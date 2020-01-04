const { isObject, merge } = require('auxiliary');

module.exports = options => ({
    createRouter: options.createRouter,
    routes: options.routes.map(route => {
        let emptyDefaultRoute;
        if (isObject(options.defaultRoute)) {
            emptyDefaultRoute = merge({}, options.defaultRoute);
        } else {
            emptyDefaultRoute = {};
        }
        const normalized = merge(emptyDefaultRoute, route);
        const policies = normalized.policies;
        if (Array.isArray(policies)) {
            normalized.policies = {};
            policies.forEach(policy => {
                normalized.policies[policy] = {};
            });
        }
        if (typeof normalized.method === 'string') {
            normalized.method = [normalized.method];
        }
        const handler = typeof normalized.handler === 'function'
            ? normalized.handler.name
            : normalized.handler
        normalized.operationId = options.handlerPrefix
            ? `${options.handlerPrefix}.${handler}`
            : handler
        if (!normalized.parameters) {
            normalized.parameters = [];
        }
        const params = [];
        normalized.path = normalized.path.replace(/:(\w+)/g, (s, name) => {
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
        })
    })
})