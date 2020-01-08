module.exports = function assignController(options, controller) {
    return {
        ...options,
        routes: options.routes.map(route => {
            const handlerName = route.operationId.split('.')[1];
            return {
                ...route,
                handler: controller[handlerName]
            }
        })
    }
}
