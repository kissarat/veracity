const { last } = require("rambda")
const { visit, deepGet, deepKey } = require("./deep")
const { getResource } = require("./resource")

const pretty = (object) => JSON.stringify(object, null, '  ')

function include(path) {
    const root = getResource(path)
    visit(root, (obj, keys, parent) => {
        if (obj.$include) {
            parent[last(keys)] = include(obj.$include)
        }
    })
    return root
}

function referenceGet(path, defs) {
    const keys = deepKey(path.slice(2))
    return deepGet(defs, keys)
}

function schemaAssign(obj, schema, defs = {}) {
    if (schema.$ref) {
        schema = referenceGet(schema.$ref, defs)
    }
    if ('object' === schema.type) {
        for(const key in schema.propeties) {
            const property = schema.propeties
            if (property.default) {
                obj[key] = property.default
            } else if ('object' === property.type) {
                obj[key] = schemaAssign({}, property, defs)
            }
        }
    }
    return obj
}

module.exports = {
    include,
    pretty,
}
