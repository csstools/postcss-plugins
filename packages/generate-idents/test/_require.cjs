const assert = require('assert');
const { generateUniqueIdent, hashFileBasenameAndDir } = require('@csstools/generate-idents');

assert.ok(typeof generateUniqueIdent === 'function');
assert.ok(typeof hashFileBasenameAndDir === 'function');
