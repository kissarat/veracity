const { readFileSync } = require("fs")
const { normalize, join } = require("path")

const getObjectFilename = path => `${path}.json`

const appPath = process.cwd()

const paths = {
    veracity: normalize(join(__dirname, '..', '..')),
    app: appPath,
    packages: join(appPath, 'packages'),
    data: join(appPath, 'data')
}

function getPath(path) {
    return paths[path]
}

function resolvePath(path, current = getPath('app')) {
    switch (path[0]) {
        case '/':
            return path;
        case '@': {
            const [alias, ...rest] = path.slice(1).split('/')
            const dir = getPath(alias)
            // console.log(path, dir, alias, ...rest)
            return normalize(join(dir, ...rest))
        }
        default:
            return normalize(join(current, path))
    }
}

function getResource(path) {
    const filename = resolvePath(path)
    const str = readFileSync(getObjectFilename(filename), { encoding: 'utf-8' })
    const root = JSON.parse(str)
    return root
}

module.exports = { getResource, getPath, resolvePath }
