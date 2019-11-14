const add = (i = 1) => (j = -1) => i + j;
const infinity = (i = Number.MAX_SAFE_INTEGER) => j => j < i

function* range(is = infinity(), next = add()) {
    for(let i = next(); is(i); i = next(i)) {
        yield i;
    }
}

const array = a => Array.prototype.slice.call(a);
