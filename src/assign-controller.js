module.exports = function assignController(options, controller) {
    const newOptions = {
        routes: options.routes.map(route => {
            const handlerName = route.operationId.split('.')[1];
            return Object.assign(route, {
                handler: controller[handlerName]
            });
        })
    };
    return Object.assign({}, options, newOptions);
}
