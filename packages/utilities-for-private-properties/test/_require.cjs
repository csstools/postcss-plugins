const assert = require('assert');
const { createPrivatePropertyTranspiler } = require('@csstools/utilities-for-private-properties');

assert.ok(typeof createPrivatePropertyTranspiler === 'function');
