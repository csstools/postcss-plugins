const assert = require('assert');
const { hasFallback, expandPropertyRule, registeredPropertyNames } = require('@csstools/utilities');

assert.ok(typeof hasFallback === 'function');
assert.ok(typeof expandPropertyRule === 'function');
assert.ok(typeof registeredPropertyNames === 'function');
