const { merge } = require('auxiliary');
const normalize = require('./normalize');
const describe = require('./describe');
const assignController = require('./assign-controller');

module.exports = (defaultOptions = {}) => {
    const mergeOptions = options => normalize(
        options
            ? merge(options, defaultOptions)
            : defaultOptions
    );
    return {
        describe: (options) => describe(mergeOptions(options)),
        register: (controller, options) => assignController(mergeOptions(options), controller),
    }
};
