import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import { parse } from './util/parse.mjs';

test('surrounding whitespace', async () => {
	const testCases = [
		{
			a: 'input&',
			b: ':hover',
			expected: 'input:hover',
		},
		{
			a: 'input&',
			b: 'div',
			expected: 'input:is(div)',
		},
		{
			a: '.foo&',
			b: ':hover',
			expected: '.foo:hover',
		},
		{
			a: '.foo&',
			b: 'div',
			expected: 'div.foo',
		},
		{
			a: 'input:is(&, :focus)',
			b: ':hover',
			expected: 'input:is(:hover,:focus)',
		},
		{
			a: 'input:is(&, :focus)',
			b: 'div',
			expected: 'input:is(div,:focus)',
		},
		{
			a: '.foo:is(&, :focus)',
			b: ':hover',
			expected: '.foo:is(:hover,:focus)',
		},
		{
			a: '.foo:is(&, :focus)',
			b: 'div',
			expected: '.foo:is(div,:focus)',
		},
		{
			a: '&',
			b: 'div',
			expected: 'div',
		},
		{
			a: '&&',
			b: 'div',
			expected: 'div:is(div)',
		},
		{
			a: '&&&',
			b: 'div',
			expected: 'div:is(div):is(div)',
		},
		{
			a: 'div&::before',
			b: ':focus',
			expected: 'div:focus::before',
		},
		{
			a: 'div::before&',
			b: ':focus',
			expected: 'div::before:focus',
		},
		{
			a: 'div::before&[attr]',
			b: ':focus',
			expected: 'div::before[attr]:focus',
		},
		{
			a: 'div::before[attr]&',
			b: ':focus',
			expected: 'div::before[attr]:focus',
		},
		{
			a: 'div&.foo&[bar]&:hover',
			b: ':focus',
			expected: 'div.foo[bar]:focus:focus:focus:hover',
		},
		{
			a: 'div&.foo&[bar]&:hover',
			b: '[value]',
			expected: 'div.foo[value][value][bar][value]:hover',
		},
		{
			a: 'div&.foo&[bar]&:hover',
			b: '.a + .b',
			expected: 'div.foo[bar]:is(.a + .b):is(.a + .b):is(.a + .b):hover',
		},
		{
			a: 'div.foo[bar]:hover&&&',
			b: ':focus',
			expected: 'div.foo[bar]:hover:focus:focus:focus',
		},
		{
			a: 'div&&&.foo[bar]:hover',
			b: ':focus',
			expected: 'div.foo[bar]:focus:focus:focus:hover',
		},
		{
			a: '&',
			b: '*',
			expected: '*',
		},
		{
			a: '*&',
			b: '*',
			expected: '*',
		},
		{
			a: '&&',
			b: '*',
			expected: '*',
		},
		{
			a: '&&&',
			b: '*',
			expected: '*',
		},
		{
			a: '&/* comment a */&/* comment b */&',
			b: '.foo',
			expected: '.foo.foo.foo/* comment a *//* comment b */',
		},
		{
			a: '&#foo&',
			b: '.foo',
			expected: '#foo.foo.foo',
		},
	];

	for (const { a, b, expected } of testCases) {
		assert.equal(
			resolveNestedSelector(parse(a), parse(b)).toString(),
			expected,
		);
	}
});
