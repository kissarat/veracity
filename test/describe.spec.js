const { equal, ok } = require('assert');
const { isObject } = require('auxiliary');
const describeSchema = require('../src/describe');

describe('describe', () => {
    it('empty', () => {
        const schema = describeSchema();
        equal(typeof schema, 'object');
    });

    it('simple', () => {
        const schema = describeSchema({
            routes: [
                {
                    method: ['GET', 'POST'],
                    path: '/users'
                },
                {
                    method: ['PUT'],
                    path: '/users'
                }
            ]
        });
        Object.keys(schema).forEach(prefix => {
            const routes = schema[prefix];
            Object.keys(routes).forEach(method => {
                const route = routes[method];
                ok(isObject(route));
            });
        });
    })
});
