const { last } = require("rambda")
const { normalize, join } = require('path')
const { visit, deepGet, deepKey } = require("./deep")
const { getResource, getPath, resolvePath } = require("./resource")

const JsonSchemaFilename = resolvePath('@node_modules/ajv/lib/refs/json-schema-2020-12/schema')

const pretty = (object) => JSON.stringify(object, null, '  ')

const createJSONLoader = (getSchemaPath) => (path) => {
    const root = getResource(path)
    visit(root, (obj, keys, parent) => {
        const externalPath = getSchemaPath(obj, keys, parent)
        if (externalPath) {
            parent[last(keys)] = include(externalPath)
        }
    })
    return root
}

const include = createJSONLoader(obj => obj.$include)

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
    JsonSchemaFilename
}
