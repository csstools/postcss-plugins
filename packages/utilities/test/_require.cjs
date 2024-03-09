const assert = require('assert');
const { hasFallback } = require('@csstools/utilities');

assert.ok(typeof hasFallback === 'function');
