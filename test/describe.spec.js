const { equal, ok } = require('assert');
const describeSchema = require('../src/describe');

const routes = [
    {
        method: ['GET', 'POST'],
        path: '/users',
        operationId: 'one'
    },
    {
        method: ['PUT'],
        path: '/users',
        operationId: 'two'
    }
];

const description = {
    summary: '7b40e7ae-c45b-475e-9d6e-6c4f61a3f26d',
}

const eachSchema = (schema, cb) => Object.keys(schema).forEach(prefix => {
    const routes = schema[prefix];
    Object.keys(routes).forEach(method => {
        cb(routes[method], method, prefix);
    });
})

describe('describe', () => {
    it('empty', () => {
        const schema = describeSchema();
        equal(typeof schema, 'object');
    });

    it('simple', () => {
        eachSchema(describeSchema({ routes }), () => {});
    });

    it('summary', () => {
        eachSchema(
            describeSchema({ routes: routes.map(r => ({
                    ...r,
                    ...description
                }))
            }),
            route => {
                equal(typeof route.summary, 'string');
            }
        );
    });

    it('operationId', () => {
        const controllerName = 'd562d197-f95d-4ebf-b78b-1c2ee0b3ca59';
        eachSchema(
            describeSchema({
                routes: routes.map(r => ({
                    ...r,
                    operationId: `${controllerName}.${r.operationId}`,
                    ...description
                }))
            }),
            route => {
                equal(typeof route.operationId, 'string');
                ok(route.operationId.indexOf(`${controllerName}.`) === 0);
            }
        );
    });
});
