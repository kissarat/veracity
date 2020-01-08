const { ok, equal } = require('assert');
const { isObject } = require('auxiliary');
const normalize = require('../src/normalize');

describe('normalize', () => {
    it('empty', () => {
        const options = normalize({ routes: [] });
        ok(isObject(options));
    });
    it('get', () => {
        const routes = [{
            method: 'GET',
            path: '/user'
        }];
        const options = normalize({ routes });
        ok(isObject(options));
        ok(Array.isArray(options.routes));
        options.routes.forEach(route => {
            // console.log(route);
            ok(isObject(route))
            ok(Array.isArray(route.method));
            // equal(typeof route.operationId, 'string');
        });
    });
});
