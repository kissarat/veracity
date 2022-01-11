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
    for (const key in obj) {
        const value = obj[key]
        if (isObjectLike(value) && depth > 0) {
            visit(value, callback, obj, depth - 1, [...keys, key])
        }
    }
    return callback(obj, keys, parent)
}

function deepClone(obj, depth = ObjectDepth) {
    if (!(depth > 0)) {
        throw new Error('Invalid depth')
    }
    const clone = {}
    for (const key in obj) {
        const value = obj[key]
        if ('function' !== typeof value) {
            clone[key] = isObjectLike(value)
                ? deepClone(value, depth - 1)
                : value
        }
    }
    return clone
}

function deepAssign(target, source, depth = ObjectDepth) {
    if (!(depth > 0)) {
        throw new Error('Invalid depth')
    }
    for (const key in source) {
        const targetValue = target[key]
        const sourceValue = source[key]
        if ('undefined' === typeof sourceValue) {
            target[key] = targetValue
        } else if (null === sourceValue) {
            delete target[key]
        } else if (isObjectLike(targetValue) && isObjectLike(sourceValue)) {
            deepAssign(targetValue, sourceValue, depth - 1)
        } else {
            target[key] = sourceValue
        }
    }
    return target
}

module.exports = { deepGet, deepKey, deepSet, deepClone, deepAssign, visit }
