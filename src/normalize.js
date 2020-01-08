const { isObject, merge } = require('auxiliary');

/**
 * Normalize router description
 */
module.exports = options => Object.assign({}, options, {
    routes: options.routes.map(route => {
        let emptyDefaultRoute;
        if (isObject(options.defaultRoute)) {
            emptyDefaultRoute = merge({}, options.defaultRoute);
        } else {
            emptyDefaultRoute = {};
        }
        const normalized = merge(emptyDefaultRoute, route);
        normalized.policies = (normalized.policies || []).map(policy => typeof policy === 'string' ? { policy } : policy);
        if (typeof normalized.method === 'string') {
            normalized.method = [normalized.method];
        }
        const handler = typeof normalized.handler === 'function'
            ? normalized.handler.name
            : (normalized.operationId || normalized.handler)
        normalized.operationId = options.controllerName
            ? `${options.handlerPrefix}.${handler}`
            : handler
        if (!normalized.parameters) {
            normalized.parameters = [];
        }
        const params = [];
        normalized.pathname = normalized.path.replace(/:(\w+)/g, (s, name) => {
            params.push(name);
            return `{${name}}`;
        });
        params.forEach(name => {
            if (!normalized.parameters.some(param => param.name === name && param.in === 'path')) {
                normalized.parameter.push(options.describeParam
                    ? options.describeParam(name, 'path')
                    : {
                        in: 'path',
                        name,
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    });
            }
        });
        return normalized;
    })
})