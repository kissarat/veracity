const Ajv = require('ajv')
const { entrypoint } = require('../lib/core')
const { JsonSchemaFilename, include } = require('../lib/json')
const { dirname } = require("path")
const { readFile } = require('fs').promises

async function loadSchema(url) {
    console.log('AAAA', url)
}

const ajv = new Ajv({
    loadSchema,
    strict: false
})

function getSchemaValidator(schema = true) {
    return ajv.compile(schema)
}

function schemaValidate(target, schema = include(JsonSchemaFilename)) {
    const validate = getSchemaValidator(schema)
    if (!validate(target)) {
        return validate
    }
}

const schemas = {
    "http://json-schema.org/schema": JsonSchemaFilename,
    "https://json-schema.org/draft/2019-09/schema": JsonSchemaFilename
}

function main(options, filename) {
    const json = include(filename)
    const result = schemaValidate(json)
    return result
}

module.exports = { getSchemaValidator, schemaValidate, main }

entrypoint(module)
