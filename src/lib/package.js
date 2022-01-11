const { readdirSync } = require("fs")
const { join } = require("path")
const { include } = require("./json")
const { getPath } = require("./resource")

function readPackage(path, packagesPath = getPath('packages')) {
    return include(join(path, 'veracity'))
}

function scanPackages(packagesPath = getPath('packages')) {
    const packages = {}
    for(const name of readdirSync(packagesPath)) {
        const pkg = readPackage(join(packagesPath, name))
        packages[name] = pkg
    }
    return packages
}

module.exports = { scanPackages }
