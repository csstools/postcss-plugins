const assert = require('assert');
const { resolveNestedSelector } = require('@csstools/selector-resolve-nested');
const parser = require('postcss-selector-parser');

const a = parser().astSync('.foo');
const b = parser().astSync('.bar');

assert.equal(resolveNestedSelector(a, b), '.bar .foo');
