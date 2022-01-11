const { getConfig, Configuration } = require('../lib/configuration')
const { entrypoint } = require('../lib/core')
const { scanPackages } = require('../lib/package')
const { resolvePath, getResource } = require('../lib/resource')

function invoke(options, location, ...args) {
    const [filename, method = 'main'] = location.split('@')

    const hasContext = this instanceof Configuration
    const context = hasContext ? this : getConfig()
    if (!hasContext) {
        const configState = getResource('@app/veracity')
        context.setState(configState)
        context.packages = scanPackages()
    }

    const pathname = filename in context.tools
        ? resolvePath(context.tools[filename])
        : resolvePath(filename, process.cwd())
    const target = require(pathname)
    const func = target[method]
    if ('function' !== typeof func) {
        throw new Error(`There are no "${method}" function in "${pathname}"`)
    }
    return func.call(context, options, ...args) 
}

module.exports = { main: invoke }

entrypoint(module)
