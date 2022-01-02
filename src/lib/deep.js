const { isObjectLike } = require('./predicates')
const { KeySplit, ObjectDepth } = require('../const')
const { last } = require('rambda')

function deepKey(keys) {
    return keys.split(KeySplit)
}

function deepGet(obj, [key, ...rest]) {
    const value = obj[key]
    if (rest.length > 0 && isObjectLike(value)) {
            return deepGet(value, rest)
    }
    return value
}

function deepSet(root, keys, value) {
    const obj = deepGet(root, keys.slice(0, -1))
    const exists = isObjectLike(obj) || false
    if (exists) {
        obj[last(keys)] = value
    }
    return exists
}

function visit(obj, callback, parent = null, depth = ObjectDepth, keys = []) {
    for(const key in obj) {
        const value = obj[key]
        if (isObjectLike(value) && depth > 0) {
            visit(value, callback, obj, depth - 1, [...keys, key])
        }
    }
    return callback(obj, keys, parent)
}

module.exports = { deepGet, deepKey, deepSet, visit }
