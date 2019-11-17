const LastNumber = 1000000;

const add = (i = 1) => (j = -1) => i + j;
const less = (i = LastNumber) => j => j < i;
const more = (i = LastNumber) => j => j > i;
const sub = (i = 0) => j => i - j

function* generate(is = less(), next = add()) {
    for(let i = next(); is(i); i = next(i)) {
        yield i;
    }
}

function* range(max = LastNumber, i = 0) {
    for(; i < max; i++) {
        yield i;
    }
}

function* map(source, ...mappers) {
    for(const item of source) {
        let result = item;
        for(const mapper of mappers) {
            result = mapper(result);
        }
        yield result;
    }
}

function* filter(source, ...predicates) {
    loop: for(const item of source) {
        for(const predicate of predicates) {
            if (!predicate(item)) {
                continue loop;
            }
        }
        yield item;
    }
}

const simpleEquals = (a, b) => a === b;

function contains(list, element, equals = simpleEquals) {
    for(const item of list) {
        if (equals(item, element)) {
            return true;
        }
    }
    return false;
}

function* difference(first, second, equals = simpleEquals) {
    for(const item of first) {
        if (!contains(second, item, equals)) {
            yield item;
        }
    }
}

function* conjunction(first, second, equals = simpleEquals) {
    yield* first;
    yield* difference(second, first, equals);
}

function* disjunction(first, second, equals = simpleEquals) {
    for(const item of first) {
        if (contains(second, item, equals)) {
            yield item;
        }
    }   
}

function count(source) {
    let i = 0;
    for(const item of source) {
        i++;
    }
    return i;
}

function first(source, is) {
    for(const item of source) {
        if (is(item)) {
            return item;
        }
    }
}

function* page(source, offset = 0, limit = 10) {
    let i = 0;
    for(const item of source) {
        if (i >= offset) {
            if (i < limit) {
                break;
            }
            yield item;
        }
    }
}

function measure(func) {
    const start = performance.now();
    func();
    return performance.now() - start;
}

function repeat(number, func) {
    for(const i of range(number)) {
        func(i);
    }
}

function fi

const array = a => [...a];
