const { readFileSync } = require("fs")
const { last } = require("rambda")
const { visit } = require("./deep")

const pretty = (object) => JSON.stringify(object, null, '  ')

function include(path) {
    const str = readFileSync(`${path}.json`, { encoding: 'utf-8'})
    const root = JSON.parse(str)
    visit(root, (obj, keys, parent) => {
        if (obj.$include) {
            parent[last(keys)] = include(obj.$include)
        }
    })
    return root
}

module.exports = {
    pretty,
    include
}
