import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

describe('at-scope', () => {
	test('explicit &', () => {
		const a = parser().astSync('.a');
		const b = parser().astSync('& .b');

		const ba = resolveNestedSelector(b, a, { ignoreImplicitNesting: true });

		assert.equal(ba.toString(), '.a .b');
	});

	test('implicit &', () => {
		const a = parser().astSync('.a');
		const b = parser().astSync('.b');

		const ba = resolveNestedSelector(b, a, { ignoreImplicitNesting: true });

		assert.equal(ba.toString(), '.b');
	});
});
