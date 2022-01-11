const { deepAssign, deepClone, deepGet, deepSet } = require('./deep')

class Configuration {
    constructor(options) {
        if (options) {
            this.setState(options)
        } else if (this.constructor.initial) {
            this.setState(this.constructor.initial)
        }
    }

    get(path) {
        return deepGet(this, path)
    }

    // TODO: make more advanced set
    set(path, value) {
        return deepSet(this, path, value)
    }

    setState(state) {
        deepAssign(this, state)
    }

    getState() {
        return deepClone(this)
    }
}

const configurations = {
    main: new Configuration()
}

/**
 * @param {string} name 
 * @return {Configuration}
 */
function getConfig(name = 'main') {
    return configurations[name]
}

module.exports = { Configuration, getConfig }
