const { Context } = require('../lib/context')
const { entrypoint } = require('../lib/core')

function invoke(options, location, ...args) {
    const [filename, method = 'main'] = location.split('@')
    const target = require(filename)
    const context = new Context()
    const func = target[method]
    return func.call(context, options, ...args) 
}

module.exports = { main: invoke }

entrypoint(module)
