const A = require("auxiliary/utilities");

async function main(options) {
    const sqliteSchema = await A.read.json();
    const schema = {
        definitions: {}
    }
    for(const [tableName, table] of Object.entries(sqliteSchema.tables)) {
        const tableSchema = {
            type: "object",
            properties: {}
        };
        for(const [name, type] of table.cols) {
            const [typename] = type.split(' ');
            tableSchema.properties[name] = {
                type: "TEXT" === typename ? "string" : "number"
            }
        }
        schema.definitions[tableName] = tableSchema;
    }
    console.log(A.pretty(schema));
}

void main(...A.getOptions());
