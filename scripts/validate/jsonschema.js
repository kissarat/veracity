const Validator = require('jsonschema').Validator;
const {read, getOptions, pretty, resolveFilename} = require('auxiliary/utilities');

const node_modules = resolveFilename('/node_modules');
const draft = require(resolveFilename('/public/schema.json'));

async function main(options,
                    jsonFilename = resolveFilename('/public/swagger.json'),
                    schemaFilename = node_modules + '/swagger-schema-official/schema.json') {
  const schema = await read.json(schemaFilename);
  const json = await read.json(jsonFilename);
  // const draft = await read.json(node_modules + '/json-schema/draft-04/schema');
  // console.log(schemaFilename, jsonFilename);
  const v = new Validator;
  v.addSchema(draft);
  const result = v.validate(json, schema);
  const errors = result.errors;
  console.log(pretty({
    // time: new Date().toISOString(),
    errors
  }));
}

if (module.parent) {
  module.exports = main
}
else {
  void main(...getOptions());
}
