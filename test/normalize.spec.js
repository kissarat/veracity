const { equal } = require('assert');
const normalize = require('../src/normalize');

describe('normalize', () => {
    it('empty', () => {
        const schema = normalize({ routes: [] });
        equal(typeof schema, 'object');
    });
});
