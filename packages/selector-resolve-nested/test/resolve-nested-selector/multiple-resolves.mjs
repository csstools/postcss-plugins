import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

test('multiple resolves', async () => {
	const a = parser().astSync('.a .aa');
	const b = parser().astSync('& + .b');
	const c = parser().astSync('.c, &');

	const a2 = parser().astSync('.a2 .aa2');

	const cb = resolveNestedSelector(c, b);
	assert.equal(cb.toString(), ':is(& + .b) .c,:is(& + .b)');

	const cba = resolveNestedSelector(cb, a);
	assert.equal(cba.toString(), ':is(:is(.a .aa) + .b) .c,:is(:is(.a .aa) + .b)');

	const cba2 = resolveNestedSelector(cb, a2);
	assert.equal(cba2.toString(), ':is(:is(.a2 .aa2) + .b) .c,:is(:is(.a2 .aa2) + .b)');
});
