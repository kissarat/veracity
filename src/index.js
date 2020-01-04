const { merge } = require('auxiliary');
const normalize = require('./normalize');
const describe = require('./describe');
const register = require('./register');

module.exports = options => {
    const normalized = normalize(options);
    const mergeOptions = options => options ? merge(options, normalized) : options;
    return {
        describe: (options) => describe(mergeOptions(options)),
        register: (contoller, options) => register(controller, mergeOptions(options)),
    }
};
