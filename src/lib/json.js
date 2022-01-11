const { join, dirname } = require("path")
const { last } = require("rambda")
const { visit, deepGet, deepKey } = require("./deep")
const { getResource, resolvePath } = require("./resource")

const JsonSchemaFilename = resolvePath('@node_modules/ajv/lib/refs/json-schema-2019-09/schema')

const pretty = (object) => JSON.stringify(object, null, '  ')

function createJSONLoader(getSchemaPath) {
    function load(path) {
        const root = getResource(path)
        visit(root, (obj, keys, parent) => {
            const externalPath = getSchemaPath(obj, keys, parent)
            if (externalPath) {
                parent[last(keys)] = load(externalPath)
            }
        })
        return root
    }
    return load
}

const include = createJSONLoader(obj => obj.$include)

function loadRefs(root, dir) {
    visit(root, (obj, keys, parent) => {
        if ('string' === typeof obj.$ref && '#' !== obj.$ref[0]) {
            const ref = obj.$ref.replace(/.json$/, '')
            const filename = '/' === ref[0]
                ? ref
                : join(dir, ref)
            const sub = include(filename)
            loadRefs(sub, dirname(filename))
            parent[last(keys)] = sub
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
        for (const key in schema.propeties) {
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
    JsonSchemaFilename,
    loadRefs,
    pretty,
    schemaAssign,
}
