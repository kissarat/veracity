const { equal } = require('assert');
const describeSchema = require('../src/describe');

describe('describe', () => {
    it('empty', () => {
        const schema = describeSchema();
        equal(typeof schema, 'object');
    });
});
