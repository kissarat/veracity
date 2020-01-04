module.exports = function register(controller, options) {
    Object.keys(controller).forEach(name => {
        const operationId = `${options.controllerName}.${name}`;
        const route = options.routes.find(r => r.operationId === operationId);
        if (route) {
            options.createRoute(route);
        } else {
            console.error(`Handler ${operationId} not found`);
        }
    })
}
