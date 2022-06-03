const assert = require('assert');
const { selectorSpecificity } = require('@csstools/selector-specificity');

assert.equal(selectorSpecificity().a, 0);
assert.equal(selectorSpecificity().b, 0);
assert.equal(selectorSpecificity().c, 0);
