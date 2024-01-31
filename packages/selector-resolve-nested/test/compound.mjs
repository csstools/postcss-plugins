import assert from 'node:assert/strict';
import test from 'node:test';
import { desugarNestedSelector, resolveNestedSelector } from '@csstools/selector-resolve-nested';
import { parse } from './util/parse.mjs';

test('surrounding whitespace', async () => {
	const testCases = [
		{
			a: 'input&',
			b: ':hover',
			expected_resolved: 'input:hover',
			expected_desugared: 'input:hover',
		},
		{
			a: 'input&',
			b: 'div',
			expected_resolved: 'input:is(div)',
			expected_desugared: 'inputdiv',
		},
		{
			a: '.foo&',
			b: ':hover',
			expected_resolved: '.foo:hover',
			expected_desugared: '.foo:hover',
		},
		{
			a: '.foo&',
			b: 'div',
			expected_resolved: 'div.foo',
			expected_desugared: '.foodiv',
		},
		{
			a: 'input:is(&, :focus)',
			b: ':hover',
			expected_resolved: 'input:is(:hover,:focus)',
			expected_desugared: 'input:is(:hover, :focus)',
		},
		{
			a: 'input:is(&, :focus)',
			b: 'div',
			expected_resolved: 'input:is(div,:focus)',
			expected_desugared: 'input:is(div, :focus)',
		},
		{
			a: '.foo:is(&, :focus)',
			b: ':hover',
			expected_resolved: '.foo:is(:hover,:focus)',
			expected_desugared: '.foo:is(:hover, :focus)',
		},
		{
			a: '.foo:is(&, :focus)',
			b: 'div',
			expected_resolved: '.foo:is(div,:focus)',
			expected_desugared: '.foo:is(div, :focus)',
		},
		{
			a: '&',
			b: 'div',
			expected_resolved: 'div',
			expected_desugared: 'div',
		},
		{
			a: '&&',
			b: 'div',
			expected_resolved: 'div:is(div)',
			expected_desugared: 'divdiv',
		},
		{
			a: '&&&',
			b: 'div',
			expected_resolved: 'div:is(div):is(div)',
			expected_desugared: 'divdivdiv',
		},
		{
			a: 'div&::before',
			b: ':focus',
			expected_resolved: 'div:focus::before',
			expected_desugared: 'div:focus::before',
		},
		{
			a: 'div::before&',
			b: ':focus',
			expected_resolved: 'div::before:focus',
			expected_desugared: 'div::before:focus',
		},
		{
			a: 'div::before&[attr]',
			b: ':focus',
			expected_resolved: 'div::before[attr]:focus',
			expected_desugared: 'div::before:focus[attr]',
		},
		{
			a: 'div::before[attr]&',
			b: ':focus',
			expected_resolved: 'div::before[attr]:focus',
			expected_desugared: 'div::before[attr]:focus',
		},
		{
			a: 'div&.foo&[bar]&:hover',
			b: ':focus',
			expected_resolved: 'div.foo[bar]:focus:focus:focus:hover',
			expected_desugared: 'div:focus.foo:focus[bar]:focus:hover',
		},
		{
			a: 'div&.foo&[bar]&:hover',
			b: '[value]',
			expected_resolved: 'div.foo[value][value][bar][value]:hover',
			expected_desugared: 'div[value].foo[value][bar][value]:hover',
		},
		{
			a: 'div&.foo&[bar]&:hover',
			b: '.a + .b',
			expected_resolved: 'div.foo[bar]:is(.a + .b):is(.a + .b):is(.a + .b):hover',
			expected_desugared: 'div.a + .b.foo.a + .b[bar].a + .b:hover',
		},
		{
			a: 'div.foo[bar]:hover&&&',
			b: ':focus',
			expected_resolved: 'div.foo[bar]:hover:focus:focus:focus',
			expected_desugared: 'div.foo[bar]:hover:focus:focus:focus',
		},
		{
			a: 'div&&&.foo[bar]:hover',
			b: ':focus',
			expected_resolved: 'div.foo[bar]:focus:focus:focus:hover',
			expected_desugared: 'div:focus:focus:focus.foo[bar]:hover',
		},
		{
			a: '&',
			b: '*',
			expected_resolved: '*',
			expected_desugared: '*',
		},
		{
			a: '*&',
			b: '*',
			expected_resolved: '*',
			expected_desugared: '**',
		},
		{
			a: '&&',
			b: '*',
			expected_resolved: '*',
			expected_desugared: '**',
		},
		{
			a: '&&&',
			b: '*',
			expected_resolved: '*',
			expected_desugared: '***',
		},
		{
			a: '&/* comment a */&/* comment b */&',
			b: '.foo',
			expected_resolved: '.foo.foo.foo/* comment a *//* comment b */',
			expected_desugared: '.foo/* comment a */.foo/* comment b */.foo',
		},
		{
			a: '&#foo&',
			b: '.foo',
			expected_resolved: '#foo.foo.foo',
			expected_desugared: '.foo#foo.foo',
		},
	];

	for (const { a, b, expected_resolved, expected_desugared } of testCases) {
		assert.equal(
			resolveNestedSelector(parse(a), parse(b)).toString(),
			expected_resolved,
			`Resolve '${a}' with '${b}'`,
		);
		assert.equal(
			desugarNestedSelector(parse(a), parse(b)).toString(),
			expected_desugared,
			`Resolve '${a}' with '${b}'`,
		);
	}
});
