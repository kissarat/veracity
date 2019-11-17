const add = (i = 1) => (j = -1) => i + j;
const last = (i = Number.MAX_SAFE_INTEGER) => j => j < i

function* range(is = last(), next = add()) {
    for(let i = next(); is(i); i = next(i)) {
        yield i;
    }
}

const array = a => [...a];
