import assert from 'assert';
import isValidReplacement from '../src/is-valid-replacement.js';

const valid = [
	'[some-attribute]',
	'[data-blank]',
	'.class',
];

const invalid = [
	'@media',
	'#id',
	'.some:not(.complex)',
	'.some:is(.complex)',
	'.some:where(.complex)',
	'::before',
	'.some .nested',
	'.some > .nested',
	'.some ~ .sibling',
	'.some + .adjacent',
];

valid.forEach(selector => assert.ok(isValidReplacement(selector)));
invalid.forEach(selector => assert.ok(!isValidReplacement(selector)));
