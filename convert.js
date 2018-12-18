const read = require('./read');
const _ = require('lodash');

async function main() {
  const model = await read();
  const schema = {
    $schema: "http://json-schema.org/draft-06/schema#",
    $id: "/" + model.info.name,
    type: 'object',
    required: [],
    properties: {}
  };
  for(const [name, rules] of Object.entries(model.attributes)) {
    const p = {};
    if (rules.required) {
      schema.required.push(name);
    }
    switch (rules.type) {
      case 'string':
      case 'email':
        p.type = 'string';
        Object.assign(p, _.pick(rules, 'minLength', 'maxLength'));
        break;
      case 'boolean':
        p.type = 'boolean';
        break;
    }
    if (!_.isEmpty(p)) {
      schema.properties[name] = p;
    }
  }
  console.log(JSON.stringify(schema, null, '\t'));
}

void main();
