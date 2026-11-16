const assert = require('assert');
const { parse, parseDashedFunctionArguments, parseFunctionParameters } = require('@csstools/custom-function-parser');

parse('--foo(--bar)');

assert.ok(typeof parseDashedFunctionArguments === 'function');
assert.ok(typeof parseFunctionParameters === 'function');
