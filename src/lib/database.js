const { writeFileSync } = require("fs");
const { join } = require("path");
const { configGet } = require("./config");
const { getObjectFilename, pretty } = require("./json");

function store(name, obj) {
    const dir = configGet('path/data')
    const filename = getObjectFilename(join(dir, name))
    writeFileSync(filename, pretty(obj))
}

module.exports = { store }
