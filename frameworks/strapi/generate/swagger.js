const {
  pretty,
  resolveFilename,
  merge,
  visitor
} = require("auxiliary/utilities");
const {
  eachRoute,
  generateRoute,
  readFiles,
  modelToSchema,
  defaultResponseDefinitionName
} = require("../../../swagger-utilities");
const strapi = require("../strapi");
const URL = require("url");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");

const definitionsPrefix = "#/definitions/";
const getReferences = visitor(
  o => o.$ref.replace(definitionsPrefix, ""),
  o =>
    _.isObject(o) &&
    "string" === typeof o.$ref &&
    o.$ref.indexOf(definitionsPrefix) === 0
);

function main() {
  const pkg = require(resolveFilename("package"));
  const defaultSwagger = require("../files/public/swagger");
  let swagger = require(resolveFilename("client", "swagger"));
  const build = require(resolveFilename("client", "build-swagger"));
  const url = URL.parse(pkg.homepage);
  swagger = merge.all([
    {},
    defaultSwagger,
    swagger,
    {
      info: {
        title: pkg.name,
        version: pkg.version
      },
      host: strapi.config.environment + "." + url.host
    }
  ]);
  swagger.schemes.push(url.protocol.slice(0, -1));

  const tags = [];

  swagger.tags = _.uniq(tags).map(name => ({ name }));

  function generateRoutes(filename, prefix, name) {
    for (const route of require(filename).routes) {
      generateRoute("api" === name ? "" : prefix, route, swagger.paths);
    }
  }

  function generateModels(dirname) {
    for (const filename of fs.readdirSync(dirname)) {
      const m = /^(\w+)\.settings\.json$/.exec(filename);
      if (m) {
        const modelSchema = modelToSchema(
          require(path.join(dirname, filename))
        );
        let schema = swagger.definitions[m[1]];
        if (schema) {
          merge(modelSchema, schema);
        }
        swagger.definitions[m[1]] = modelSchema;
      }
    }
  }

  readFiles(resolveFilename("api"), "config/routes.json", generateRoutes);
  readFiles(resolveFilename("api"), "models", generateModels);
  readFiles(resolveFilename("plugins"), "config/routes.json", generateRoutes);
  readFiles(resolveFilename("plugins"), "models", generateModels);

  eachRoute(swagger.paths, function(pathname, method, route) {
    if (!route.responses) {
      route.responses = {
        "200": { schema: { $ref: defaultResponseDefinitionName } }
      };
    }
    const parameters = route.parameters || [];
    const variables = [];
    pathname = pathname.replace(/\{([\w_]+)\}/g, function(s, name) {
      variables.push(name);
      return `{${name}}`;
    });
    for (const name of variables) {
      if (!parameters.find(p => name === p.name)) {
        parameters.push({
          in: "path",
          name,
          required: true,
          type: "string"
        });
      }
    }
    if (parameters.length > 0) {
      route.parameters = parameters;
    }
    for (const [status, response] of Object.entries(route.responses)) {
      if ("string" !== typeof response.description) {
        response.description = "";
      }
    }
    // route.tags = _.uniq(route.tags);
    // route.produces = _.uniq(route.produces);
    if (route.tags) {
      tags.push(...route.tags);
    }
  });

  swagger = build(swagger);
  // const keep = resolveFilename('client', 'keep');
  // let references = getReferences(swagger);
  // if (keep.definitions) {
  //   references.push(...keep.definitions);
  // }
  // references = _.uniq(references);
  // for (const name in swagger.definitions) {
  //   if (!references.includes(name)) {
  //     delete swagger.definitions[name];
  //   }
  // }

  // eachRoute(swagger.paths, function(pathname, method, route) {
  //   if (!route.produces) {
  //     route.produces = ["application/json"];
  //   }
  // });
  //   const vars = {
  //     origin: pkg.homepage
  //   };
  console.log(pretty(swagger));
}

main();
