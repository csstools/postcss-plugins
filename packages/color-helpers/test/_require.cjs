const assert = require('assert');
const { clip } = require('@csstools/color-helpers');

assert.equal(typeof clip, 'function', 'should export nested libraries');
