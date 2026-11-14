const assert = require('assert');
const { hasFallback, hasSupportsAtRuleAncestor } = require('@csstools/utilities');

assert.ok(typeof hasFallback === 'function');
assert.ok(typeof hasSupportsAtRuleAncestor === 'function');
