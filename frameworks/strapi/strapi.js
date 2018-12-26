const {resolveFilename, pretty} = require('auxiliary/utilities');
const path = require('path');
const fs = require('fs');

function globSync(pattern) {
  const dirname = path.dirname(pattern);
  const filename = path.basename(pattern);
  const regexString = filename.replace(/\./g, "\\.").replace(/\*/g, ".*");
  const regex = new RegExp("^" + regexString + "$");
  const filenames = [];
  for (const filename of fs.readdirSync(dirname)) {
    if (regex.test(filename)) {
      filenames.push(path.join(dirname, filename));
    }
  }
  return filenames;
}

const strapi = {
  config: {
    environment: process.env.NODE_ENV || "development"
  }
};

function main() {
    const currentEnvironment = {};
    const configPattern = resolveFilename('config', 'environments', strapi.config.environment, '*.json');
    for(const filename of globSync(configPattern)) {
        Object.assign(currentEnvironment, require(filename));
    }
    strapi.config.currentEnvironment = currentEnvironment;
}

void main();

module.exports = strapi;

if(!module.parent) {
    console.log(pretty(strapi));    
}
