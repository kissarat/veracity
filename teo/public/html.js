const createQuotes = (before, after = before) => string => before + string + after;
const doubleQuotes = createQuotes('"');
