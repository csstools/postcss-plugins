const assert = require('assert');
const { deltaEOK } = require('@csstools/color-helpers').calculations;
const { calculations } = require('@csstools/color-helpers');

assert.equal(typeof deltaEOK, 'function', 'should export nested libraries');
assert.equal(typeof calculations.deltaEOK, 'function', 'should be possible to import from index');
