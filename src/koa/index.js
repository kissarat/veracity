const Router = require('koa-router');
const createSwaggerRouter = require('..');

module.exports = options => {
    return createSwaggerRouter({
        ...options,
        createRoute(router) {

        }
    });
}
