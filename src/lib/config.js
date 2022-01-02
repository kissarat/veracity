const { readdirSync } = require('fs')
const { join, normalize } = require('path')
const { entrypoint } = require('./core')
const { deepGet, deepKey } = require('./deep')
const { include } = require('./json')

const dir = normalize(join(__dirname, '..', '..'))

let config

function storeConfig() {
    const db = require('./database')
    db.store('config', config)
}

function getConfig() {
    if (!config) {
        config = include(join(dir, 'veracity'))
        config.path.app = dir
        config.path.packages = join(dir, 'packages')
        config.path.data = join(dir, 'data')
        for(const name of readdirSync(config.path.packages)) {
            const pkg = include(join(config.path.packages, name, 'veracity'))
            config.packages[name] = pkg
        }
        process.nextTick(storeConfig)
    }
    return config
}

function configGet(keys) {
    const config = getConfig()
    return deepGet(config, deepKey(keys))    
}

module.exports = { main: getConfig, configGet }

entrypoint(module)
