const { getConfig } = require('../lib/configuration')
const { entrypoint } = require('../lib/core')
const { scanPackages } = require('../lib/package')
const { resolvePath, getResource } = require('../lib/resource')

function invoke(options, location, ...args) {
    const [filename, method = 'main'] = location.split('@')
    const pathname = resolvePath(filename, process.cwd())
    const target = require(pathname)
    const context = getConfig()
    const configState = getResource('@app/veracity')
    context.setState(configState)
    context.packages = scanPackages()
    const func = target[method]
    return func.call(context, options, ...args) 
}

module.exports = { main: invoke }

entrypoint(module)
