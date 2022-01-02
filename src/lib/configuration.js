const { pick } = require('rambda')

function getState(obj, keys = Object.keys(obj)) {
    return pick(keys, obj)
}

class Configuration {
    constructor(options) {
        if (options) {
            this.setState(options)
        } else if (this.constructor.initial) {
            this.setState(this.constructor.initial)
        }
    }

    setState(state) {
        Object.assign(this, state)
    }

    getState(keys = Object.keys(this)) {
        return getState(this, keys)
    }
}

module.exports = { Configuration, getState }
