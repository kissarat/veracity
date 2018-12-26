const _ = require("lodash");
const { merge } = require("auxiliary/utilities");
const fs = require("fs");
const path = require("path");

const JSON_FORMAT = "application/json";

function eachRoute(paths, cb) {
  for (let [path, methods] of Object.entries(paths)) {
    for (const [method, route] of Object.entries(methods)) {
      if (false === cb(path, method, route, methods, paths)) {
        return;
      }
    }
  }
}

function toModelName(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function toDefinitionName(name) {
  return "#/definitions/" + toModelName(name);
}

function modelToSchema(model) {
  const schema = {
    type: "object",
    required: [],
    properties: {}
  };

  for (const [name, rules] of Object.entries(model.attributes)) {
    if (rules.private) {
      continue;
    }
    const p = {};
    if (rules.required) {
      schema.required.push(name);
    }
    if (rules.model) {
      p.$ref = toDefinitionName(rules.model);
    } else if (rules.collection) {
      p.type = "array";
      p.items = { $ref: toDefinitionName(rules.collection) };
    } else {
      switch (rules.type) {
        case "string":
        case "email":
          p.type = "string";
          Object.assign(p, _.pick(rules, "minLength", "maxLength"));
          break;
        case "boolean":
          p.type = "boolean";
          break;
      }
    }
    if (!_.isEmpty(p)) {
      schema.properties[name] = p;
    }
  }

  if (!schema.properties._id) {
    schema.properties._id = {
      type: "string",
      pattern: "^[0-9a-fA-F]{24}$"
    };
    schema.required.push("_id");
  }
  if (model.options && false !== model.options.timestamps) {
    for (const name of ["createdAt", "updatedAt"]) {
      if (!schema.properties[name]) {
        schema.properties[name] = {
          type: "string",
          format: "date-time"
        };
      }
    }
  }
  return schema;
}

function generateRoute(prefix, route, paths) {
  const pathname = route.path.replace(/:([\w_]+)/g, function(s, name) {
    return `{${name}}`;
  });
  const method = route.method.toLowerCase();
  const desc = {
    tags: [route.handler.split(".")[0].toLowerCase()]
  };
  if (route.prefix) {
    prefix = route.prefix;
  }
  if (!paths[pathname]) {
    paths[pathname] = {};
  }
  if (paths[pathname][method]) {
    paths[pathname][method] = merge(desc, paths[pathname][method]);
  } else {
    paths[pathname][method] = desc;
  }
}

function readFiles(apiDir, sub, cb) {
  for (const apiName of fs.readdirSync(apiDir)) {
    const filename = path.join(apiDir, apiName, sub);
    if (fs.existsSync(filename)) {
      cb(filename, apiName, apiDir);
    }
  }
}

const defaultResponseDefinitionName = "#/definitions/defaultResponse";

function isDefaultResponse(responses) {
  const ok = responses["200"];
  return ok && ok.schema && defaultResponseDefinitionName == ok.schema.$ref;
}

module.exports = {
  eachRoute,
  modelToSchema,
  readFiles,
  generateRoute,
  defaultResponseDefinitionName,
  isDefaultResponse,
  toDefinitionName,
  toModelName
};
