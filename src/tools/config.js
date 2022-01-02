const { join } = require('path')
const { entrypoint } = require('../lib/core')
const { include } = require('../lib/json')

function getConfig() {
    const config = include(join(__dirname, '..', '..', 'veracity'))
    return config
}

module.exports = { main: getConfig }

entrypoint(module)
