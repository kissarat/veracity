function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return Object.prototype.toString.call(value)
}

function ofType(type) {
    if (isString(type)) {
        return function isPrimitive(value) {
            return typeof value === type
        }
    } else if (isFunction(type)) {
        return function isInstance(value) {
            return isObject(value) && value instanceof type
        }
    } else {
        throw new Error(`Unknown type ${type}`)
    }
}

function isObjectLike(obj) {
    return 'object' === typeof obj && null !== obj
}

function isUnsignedInteger(number) {
    return isNumber(number) && Number.isInteger(number) && number > 0;
}

function isNatural(number) {
    return isNumber(number) && Number.isInteger(number) && number >= 0;
}

// function isPlainObject(obj) {
//     return isObjectLike(obj) && (!obj.constructor || Object === obj.constructor);
// }

const isHexObjectId = string => typeof string === 'string' && ObjectIdRegExp.test(string)

function isEmpty(obj) {
    if (isString(obj)) {
        return obj.trim().length === 0
    }
    if (!isObjectLike(obj)) {
        return !obj
    }
    if (Array.isArray(obj)) {
        return obj.length === 0
    }
    return Object.keys(obj).length === 0
}

function isNaN(n) {
    return Number.isNaN(n)
}

function isStrictComparable(value) {
    return value === value && !isObject(value)
}

function isPrototype(value) {
    const Ctor = value && value.constructor
    const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto

    return value === proto
}

function not(predicate) {
    return function (...args) {
        return !predicate(...args)
    }
}

function or(...predicates) {
    return function (...args) {
        for (const predicate of predicates) {
            if (predicate(...args)) {
                return true
            }
        }
        return false
    }
}

function and(...predicates) {
    return function (...args) {
        for (const predicate of predicates) {
            if (!predicate(...args)) {
                return false
            }
        }
        return true
    }
}

function endsWith(string, part) {
    return string.indexOf(part) === string.length - part.length - 1
}

function startsWith(string, part) {
    return string.indexOf(part) === 0
}

function isStringEquals(a, b) {
    return a === b || (a && b && a.toString() === b.toString());
  }
  
function isAdmin(user) {
    return user && 'admin' === user.role
}

const isJsonSchemaObject = obj => 'object' === obj.type
  && optional(obj.required, Array.isArray)
  && isObject(obj.properties)
  && Object.keys(obj.properties).every(name => isJsonSchemaType(obj.properties[name]))

module.exports = {
    and,
    endsWith,
    getTag,
    isAdmin,
    isEmpty,
    isHexObjectId,
    isJsonSchemaObject,
    isNaN,
    isNatural,
    isObjectLike,
    isPrototype,
    isStrictComparable,
    isStringEquals,
    isUnsignedInteger,
    not,
    ofType,
    or,
    startsWith,
}
