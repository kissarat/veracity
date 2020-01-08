const { equal } = require('assert');
const describeSchema = require('../src/describe');

describe('describe', () => {
    it('empty', () => {
        const schema = describeSchema();
        equal(typeof schema, 'object');
    });

    it('get', () => {
        const schema = describeSchema({
            routes: [{
                method: ['GET']
            }]
        });
        Object.keys(schema).forEach(prefix => {
            const routes = schema[prefix];
            Object.keys(routes).forEach(method => {
                const route = routes[method];
                assert(isObject(route));
                equal(Array.isArray(route.method));
                equal(route.method.every(method => ['GET'].includes(method)));
            });
        });
    })
});
