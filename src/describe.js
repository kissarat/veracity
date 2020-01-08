const { pick } = require('auxiliary');

module.exports = function describe(options = { routes: [] }) {
    const routes = {};
    options.routes.forEach(route => {
        if (!routes[route.path]) {
            routes[route.path] = {}
        }
    })
    Object.keys(routes).forEach(pathname => {
        options.routes
            .filter(r => r.pathname === pathname)
            .forEach(route => {
                route.method.forEach(method => {
                    routes[route.pathname][method.toLowerCase()] = pick(route, 'operationId', 'summary', 'parameters', 'response');
                })
            });
    });
}
