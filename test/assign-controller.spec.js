const { equal } = require('assert');
const assignController = require('../src/assign-controller');

const reducer = (acc, name) => {
    acc[name] = () => name;
    return acc;
};

describe('assignController', () => {
    it('main', () => {
        const controller = [
            'b6aaa04d-059c-417d-a779-ac01f261e395',
            '1c485b09-fe5f-4cfc-90b4-087167e37010',
            '5f2830c8-4bd7-4e5e-9fa9-d35589e6a6c4',
        ]
        .reduce(reducer, {});
        const controllerId = '24be3d97-2f03-4bdb-97a3-f04e95cab5ec';
        const routes = Object.keys(controller).map(actionId => ({
            operationId: `${controllerId}.${actionId}`
        }));
        const options = assignController({ routes }, controller);
        options.routes.forEach(route => {
            equal(typeof route.handler, 'function');
            equal(route.handler(), route.operationId.split('.')[1]);
        })
    })
});
