var readline = require("readline");
var { pretty, read } = require("auxiliary/utilities");
const httpStatus = require('./http-status');
const _ = require("lodash");

const defaults = {
  types: {
    object: {
      type: "object"
    },
    string: {
      type: "string",
      maxLength: 8192
    },
    number: {
      type: "number",
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER
    }
  },
  keys: {
    statusCode: {
      // enum: httpStatus.codes
    },
    error: {
      maxLength: 32
    },
    message: {
      maxLength: 256
    }
  }
};


function convert(attributes) {
  const schema = {
    // $schema: "http://json-schema.org/draft-06/schema#",
    // $id: "/" + model.info.name,
    type: "object",
    required: [],
    properties: {}
  };
  for (const [key, value] of Object.entries(attributes)) {
    let p = {};
    const jsType = typeof value;
    schema.required.push(key);
    if (defaults.types[jsType]) {
      Object.assign(p, defaults.types[jsType]);
    }
    if (defaults.keys[key]) {
      Object.assign(p, defaults.keys[key]);
    }
    switch (jsType) {
      case "object":
        if (value) {
          p = convert(value);
        }
    }
    if (!_.isEmpty(p)) {
      schema.properties[key] = p;
    }
  }
  return schema;
}

var cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function describe(json) {
  const schema = convert(json);
  console.log(
    pretty({
      description: json.message || "",
      schema,
      examples: {
        "application/json": json
      }
    })
  );
}

let lines = [];
cli.on("line", function(line) {
  if ("clear" === line.trim()) {
    lines = [];
    return;
  }
  lines.push(line);
  try {
    const json = JSON.parse(lines.join("\n"));
    if (_.isEmpty(json)) {
      return;
    }
    describe(json);
    lines = [];
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      console.error(err);
    }
  }
});

// async function main() {
//   describe(read.json(__dirname + '/example.json'));
// }

// void main();
