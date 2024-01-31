import assert from 'node:assert/strict';
import test from 'node:test';
import { desugarNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

test('multiple resolves', async () => {
	const a = parser().astSync('.a .aa');
	const b = parser().astSync('& + .b');
	const c = parser().astSync('.c, &');

	const a2 = parser().astSync('.a2 .aa2');

	const cb = desugarNestedSelector(c, b);
	assert.equal(cb.toString(), '& + .b .c,& + .b');

	const cba = desugarNestedSelector(cb, a);
	assert.equal(cba.toString(), '.a .aa + .b .c,.a .aa + .b');

	const cba2 = desugarNestedSelector(cb, a2);
	assert.equal(cba2.toString(), '.a2 .aa2 + .b .c,.a2 .aa2 + .b');
});
