const assert = require('assert');
const { hasFallback, rewritePropertyNames, registeredPropertyNames } = require('@csstools/utilities');

assert.ok(typeof hasFallback === 'function');
assert.ok(typeof rewritePropertyNames === 'function');
assert.ok(typeof registeredPropertyNames === 'function');
