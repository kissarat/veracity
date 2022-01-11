const { entrypoint } = require('./core')

function main() {
    return this.getState()
}

module.exports = { main }

entrypoint(module)
