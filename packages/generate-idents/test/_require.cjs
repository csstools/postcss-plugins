const assert = require('assert');
const { generateUniqueDashedIdent, hashFileBasenameAndDir } = require('@csstools/generate-idents');

assert.ok(typeof generateUniqueDashedIdent === 'function');
assert.ok(typeof hashFileBasenameAndDir === 'function');
