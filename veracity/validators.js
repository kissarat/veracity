const validator = require('validator');

const validators = {
  number: {
    
  }
};

for(const key in validator) {
  if (key.indexOf('is') === 0) {
    let name = key[2].toLowerCase() + key.slice(3);
    validators[name] = validator[key];
  }
}
