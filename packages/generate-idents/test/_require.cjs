const assert = require('assert');
const { generatedName } = require('@csstools/generate-idents');

assert.ok(typeof generatedName === 'function');
