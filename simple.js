var Validator = require('jsonschema').Validator;
var v = new Validator();

const r = v.validate({username: 'abcd'}, {
  type: 'object',
  properties: {
    username: {
      minLength: 4,
      maxLength: 8
    }
  }
});
console.log(JSON.stringify(r, null, '\t'));
