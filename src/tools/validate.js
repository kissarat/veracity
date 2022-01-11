const Ajv = require('ajv')
const { entrypoint } = require('../lib/core')
const { JsonSchemaFilename } = require('../lib/json')

const ajv = new Ajv()

function getSchemaValidator(schema) {
    return ajv.compile(schema)
}

function schemaValidate(target, schemaURL = target.$schema) {
    const validate = getSchemaValidator(schema)
    if (!validate(target)) {
        return validate
    }
}

const schemas = {
    "http://json-schema.org/schema": JsonSchemaFilename
}

function main(options, filename) {
    return JsonSchemaFilename
}

module.exports = { getSchemaValidator, schemaValidate, main }

entrypoint(module)
