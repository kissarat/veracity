const { basename } = require('path');
const { isObjectLike } = require('./predicates');
const { isPromise } = require('util').types;

function getProcessArguments(args = process.argv) {
    // const nodeIndex = isElectronNode ? 0 : args.map(a => basename(a)).indexOf('node');
    const nodeIndex = args.map(a => basename(a)).indexOf('node');
    if (nodeIndex < 0) {
        throw new Error(`Program node not found at "${args.join(' ')}"`)
    }
    return args.slice(nodeIndex + 2);
}

function getOptions(args = process.argv, options = {}) {
    const ordered = [];
    for (const arg of getProcessArguments(args, options)) {
        if (arg.indexOf("--") === 0) {
            const p = arg.split("=");
            options[p[0].slice(2)] = 2 === p.length ? p[1] : true;
        } else {
            ordered.push(arg);
        }
    }
    return [options, ...ordered];
}

function processProgramResult(result) {
    if (isObjectLike(result)) {
      console.log(
        Array.isArray(result)
          ? result.join('\n')
          : JSON.stringify(result, null, '  ')
      )
    } else if ('undefined' !== typeof result) {
      if ('boolean' === typeof result) {
        process.exit(result ? 0 : 1)
      } else {
        console.log(result)
      }
    }
  }
  
const entrypoints = {}

function entrypoint(module, name) {
    const { main } = module.exports
    if ('function' !== typeof main) {
        throw new Error('exports.main is not a function')
    }
    if (!name) {
        name = basename(module.filename).replace(/.js$/, '')
        if ('index' === name) {
            name = basename(dirname(module.filename))
        }
    }
    entrypoints[name] = module.filename
    if (require.main !== module) {
        return
    }
    const [options, ...positional] = getOptions()
    for (const param in options) {
        const name = param.toUpperCase().replace(/\-/g, '_')
        if (!has(name)) {
            continue
        }
        let value = options[param]
        if ('boolean' === typeof value) {
            value = value ? '1' : '0'
        }
        set(name, value)
        delete options[param]
    }
    try {
        let result = main(options, ...positional)
        if (isPromise(result)) {
            result
                .then(processProgramResult)
                .catch(function (err) {
                    console.error(err)
                    process.exit(1)
                })
        } else {
            processProgramResult(result)
        }
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = {
    entrypoint,
    getOptions,
    getProcessArguments
}
