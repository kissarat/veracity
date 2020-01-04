const { pick } = require('auxiliary');

module.exports = function describe(options) {
    const routes = {};
    options.routes.forEach(route => {
        if (!routes[route.path]) {
            routes[route.path] = {}
        }
    })
    Object.keys(routes).forEach(pathname => {
        options.routes
            .filter(r => r.path === pathname)
            .forEach(route => {
                route.method.forEach(method => {
                    routes[route.path][method.toLowerCase()] = {
                        operationId: route.operationId,
                        ...pick('summary', 'parameters', 'response')
                    }
                })
            });
    });
}
