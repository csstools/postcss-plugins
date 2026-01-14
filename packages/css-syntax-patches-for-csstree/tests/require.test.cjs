const assert = require('node:assert');
const syntax_patches_a = require('@csstools/css-syntax-patches-for-csstree');

assert.ok(syntax_patches_a.next);

const syntax_patches_b = require('@csstools/css-syntax-patches-for-csstree/dist/index.json');

assert.ok(syntax_patches_b.next);
