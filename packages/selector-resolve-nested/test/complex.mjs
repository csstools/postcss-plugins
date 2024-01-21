import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import { parse } from './util/parse.mjs';

test('surrounding whitespace', async () => {
	const testCases = [
		{
			a: '.foo + .fooz',
			b: '.bar + .baz',
			expected: ':is(.bar + .baz) .foo + .fooz',
		},
		{
			a: '.foo+.fooz',
			b: '.bar+.baz',
			expected: ':is(.bar + .baz) .foo + .fooz',
		},
		{
			a: '+ &',
			b: '.bar + .baz',
			expected: ':is(.bar + .baz) + :is(.bar + .baz)',
		},
		{
			a: '+&',
			b: '.bar +.baz',
			expected: ':is(.bar + .baz) + :is(.bar + .baz)',
		},
		{
			a: '.foo + &',
			b: '.bar + .baz',
			expected: '.foo + :is(.bar + .baz)',
		},
		{
			a: '& + .foo',
			b: '.bar + .baz',
			expected: ':is(.bar + .baz) + .foo',
		},
		{
			a: '& .foo',
			b: '.bar .baz',
			expected: ':is(.bar .baz) .foo',
		},
		{
			a: '& .foo, .fooz',
			b: '.bar .baz',
			expected: ':is(.bar .baz) .foo,:is(.bar .baz) .fooz',
		},
		{
			a: ':has(&)',
			b: '.bar',
			expected: ':has(:is(.bar))',
		},
		{
			a: ':has(&)',
			b: '.bar .baz',
			expected: ':has(:is(.bar .baz))',
		},
		{
			a: '.baz, &, :where(.bar, &, &:is(.foo, &, &:has(.fooz, &)))',
			b: '.a',
			expected: '.a .baz,.a,:where(.bar,.a,.a:is(.foo,.a,.a:has(.fooz,:is(.a))))',
		},
		{
			a: 'div&::before',
			b: '.bar + .baz',
			expected: 'div:is(.bar + .baz)::before',
		},
		{
			a: 'div::before&',
			b: '.bar + .baz',
			expected: 'div::before:is(.bar + .baz)',
		},
		{
			a: '&',
			b: '::before:hover',
			expected: ':is(::before:hover)',
		},
		{
			a: '&,.foo',
			b: '',
			expected: ', .foo',
		},
		{
			a: ':is(&)',
			b: '',
			expected: ':is()',
		},
		{
			a: '',
			b: '.a',
			expected: '.a ',
		},
	];

	for (const { a, b, expected } of testCases) {
		assert.equal(
			resolveNestedSelector(parse(a), parse(b)).toString(),
			expected,
		);
	}
});
