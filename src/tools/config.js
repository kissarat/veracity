const { entrypoint } = require('../lib/core')

function main() {
    return this.getState()
}

module.exports = { main }

entrypoint(module)
