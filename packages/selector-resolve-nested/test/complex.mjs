import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNestedSelector, desugarNestedSelector } from '@csstools/selector-resolve-nested';
import { parse } from './util/parse.mjs';

test('surrounding whitespace', async () => {
	const testCases = [
		{
			a: '.foo + .fooz',
			b: '.bar + .baz',
			expected_resolved: ':is(.bar + .baz) .foo + .fooz',
			expected_desugared: '.bar + .baz .foo + .fooz',
		},
		{
			a: '.foo+.fooz',
			b: '.bar+.baz',
			expected_resolved: ':is(.bar + .baz) .foo + .fooz',
			expected_desugared: '.bar+.baz .foo+.fooz',
		},
		{
			a: '+ &',
			b: '.bar + .baz',
			expected_resolved: ':is(.bar + .baz) + :is(.bar + .baz)',
			expected_desugared: '.bar + .baz+ .bar + .baz',
		},
		{
			a: '+&',
			b: '.bar +.baz',
			expected_resolved: ':is(.bar + .baz) + :is(.bar + .baz)',
			expected_desugared: '.bar +.baz+.bar +.baz',
		},
		{
			a: '.foo + &',
			b: '.bar + .baz',
			expected_resolved: '.foo + :is(.bar + .baz)',
			expected_desugared: '.foo + .bar + .baz',
		},
		{
			a: '& + .foo',
			b: '.bar + .baz',
			expected_resolved: ':is(.bar + .baz) + .foo',
			expected_desugared: '.bar + .baz + .foo',
		},
		{
			a: '& .foo',
			b: '.bar .baz',
			expected_resolved: ':is(.bar .baz) .foo',
			expected_desugared: '.bar .baz .foo',
		},
		{
			a: '& .foo, .fooz',
			b: '.bar .baz',
			expected_resolved: ':is(.bar .baz) .foo,:is(.bar .baz) .fooz',
			expected_desugared: '.bar .baz .foo,.bar .baz  .fooz',
		},
		{
			a: ':has(&)',
			b: '.bar',
			expected_resolved: ':has(:is(.bar))',
			expected_desugared: ':has(.bar)',
		},
		{
			a: ':has(&)',
			b: '.bar .baz',
			expected_resolved: ':has(:is(.bar .baz))',
			expected_desugared: ':has(.bar .baz)',
		},
		{
			a: '.baz, &, :where(.bar, &, &:is(.foo, &, &:has(.fooz, &)))',
			b: '.a',
			expected_resolved: '.a .baz,.a,:where(.bar,.a,.a:is(.foo,.a,.a:has(.fooz,:is(.a))))',
			expected_desugared: '.a .baz,.a, :where(.bar,.a,.a:is(.foo,.a,.a:has(.fooz,.a)))',
		},
		{
			a: 'div&::before',
			b: '.bar + .baz',
			expected_resolved: 'div:is(.bar + .baz)::before',
			expected_desugared: 'div.bar + .baz::before',
		},
		{
			a: 'div::before&',
			b: '.bar + .baz',
			expected_resolved: 'div::before:is(.bar + .baz)',
			expected_desugared: 'div::before.bar + .baz',
		},
		{
			a: '&',
			b: '::before:hover',
			expected_resolved: ':is(::before:hover)',
			expected_desugared: '::before:hover',
		},
		{
			a: '&,.foo',
			b: '',
			expected_resolved: ', .foo',
			expected_desugared: ', .foo',
		},
		{
			a: ':is(&)',
			b: '',
			expected_resolved: ':is()',
			expected_desugared: ':is()',
		},
		{
			a: '',
			b: '.a',
			expected_resolved: '.a ',
			expected_desugared: '.a ',
		},
		{
			a: '& &:hover, & &[hover]',
			b: '.alpha [one], .beta [two]',
			expected_resolved: ':is(.alpha [one],.beta [two]) :is(.alpha [one],.beta [two]):hover,:is(.alpha [one],.beta [two]) [hover]:is(.alpha [one],.beta [two])',
			expected_desugared: '.alpha [one] .alpha [one]:hover,.alpha [one]  .beta [two]:hover, .beta [two] .alpha [one]:hover, .beta [two]  .beta [two]:hover,.alpha [one] .alpha [one][hover],.alpha [one]  .beta [two][hover], .beta [two] .alpha [one][hover], .beta [two]  .beta [two][hover]',
		},
		{
			a: '& &',
			b: '.alpha, .beta',
			expected_resolved: ':is(.alpha,.beta) :is(.alpha,.beta)',
			expected_desugared: '.alpha .alpha,.alpha  .beta, .beta .alpha, .beta  .beta',
		},
		{
			a: '& & &',
			b: '.alpha, .beta, .delta',
			expected_resolved: ':is(.alpha,.beta,.delta) :is(.alpha,.beta,.delta) :is(.alpha,.beta,.delta)',
			expected_desugared: '.alpha .alpha .alpha,.alpha .alpha  .beta,.alpha .alpha  .delta,.alpha  .beta .alpha,.alpha  .beta  .beta,.alpha  .beta  .delta,.alpha  .delta .alpha,.alpha  .delta  .beta,.alpha  .delta  .delta, .beta .alpha .alpha, .beta .alpha  .beta, .beta .alpha  .delta, .beta  .beta .alpha, .beta  .beta  .beta, .beta  .beta  .delta, .beta  .delta .alpha, .beta  .delta  .beta, .beta  .delta  .delta, .delta .alpha .alpha, .delta .alpha  .beta, .delta .alpha  .delta, .delta  .beta .alpha, .delta  .beta  .beta, .delta  .beta  .delta, .delta  .delta .alpha, .delta  .delta  .beta, .delta  .delta  .delta',
		},
		{
			a: '& & & &',
			b: '.alpha, .beta, .delta, .gamma',
			expected_resolved: ':is(.alpha,.beta,.delta,.gamma) :is(.alpha,.beta,.delta,.gamma) :is(.alpha,.beta,.delta,.gamma) :is(.alpha,.beta,.delta,.gamma)',
			expected_desugared: '.alpha .alpha .alpha .alpha,.alpha .alpha .alpha  .beta,.alpha .alpha .alpha  .delta,.alpha .alpha .alpha  .gamma,.alpha .alpha  .beta .alpha,.alpha .alpha  .beta  .beta,.alpha .alpha  .beta  .delta,.alpha .alpha  .beta  .gamma,.alpha .alpha  .delta .alpha,.alpha .alpha  .delta  .beta,.alpha .alpha  .delta  .delta,.alpha .alpha  .delta  .gamma,.alpha .alpha  .gamma .alpha,.alpha .alpha  .gamma  .beta,.alpha .alpha  .gamma  .delta,.alpha .alpha  .gamma  .gamma,.alpha  .beta .alpha .alpha,.alpha  .beta .alpha  .beta,.alpha  .beta .alpha  .delta,.alpha  .beta .alpha  .gamma,.alpha  .beta  .beta .alpha,.alpha  .beta  .beta  .beta,.alpha  .beta  .beta  .delta,.alpha  .beta  .beta  .gamma,.alpha  .beta  .delta .alpha,.alpha  .beta  .delta  .beta,.alpha  .beta  .delta  .delta,.alpha  .beta  .delta  .gamma,.alpha  .beta  .gamma .alpha,.alpha  .beta  .gamma  .beta,.alpha  .beta  .gamma  .delta,.alpha  .beta  .gamma  .gamma,.alpha  .delta .alpha .alpha,.alpha  .delta .alpha  .beta,.alpha  .delta .alpha  .delta,.alpha  .delta .alpha  .gamma,.alpha  .delta  .beta .alpha,.alpha  .delta  .beta  .beta,.alpha  .delta  .beta  .delta,.alpha  .delta  .beta  .gamma,.alpha  .delta  .delta .alpha,.alpha  .delta  .delta  .beta,.alpha  .delta  .delta  .delta,.alpha  .delta  .delta  .gamma,.alpha  .delta  .gamma .alpha,.alpha  .delta  .gamma  .beta,.alpha  .delta  .gamma  .delta,.alpha  .delta  .gamma  .gamma,.alpha  .gamma .alpha .alpha,.alpha  .gamma .alpha  .beta,.alpha  .gamma .alpha  .delta,.alpha  .gamma .alpha  .gamma,.alpha  .gamma  .beta .alpha,.alpha  .gamma  .beta  .beta,.alpha  .gamma  .beta  .delta,.alpha  .gamma  .beta  .gamma,.alpha  .gamma  .delta .alpha,.alpha  .gamma  .delta  .beta,.alpha  .gamma  .delta  .delta,.alpha  .gamma  .delta  .gamma,.alpha  .gamma  .gamma .alpha,.alpha  .gamma  .gamma  .beta,.alpha  .gamma  .gamma  .delta,.alpha  .gamma  .gamma  .gamma, .beta .alpha .alpha .alpha, .beta .alpha .alpha  .beta, .beta .alpha .alpha  .delta, .beta .alpha .alpha  .gamma, .beta .alpha  .beta .alpha, .beta .alpha  .beta  .beta, .beta .alpha  .beta  .delta, .beta .alpha  .beta  .gamma, .beta .alpha  .delta .alpha, .beta .alpha  .delta  .beta, .beta .alpha  .delta  .delta, .beta .alpha  .delta  .gamma, .beta .alpha  .gamma .alpha, .beta .alpha  .gamma  .beta, .beta .alpha  .gamma  .delta, .beta .alpha  .gamma  .gamma, .beta  .beta .alpha .alpha, .beta  .beta .alpha  .beta, .beta  .beta .alpha  .delta, .beta  .beta .alpha  .gamma, .beta  .beta  .beta .alpha, .beta  .beta  .beta  .beta, .beta  .beta  .beta  .delta, .beta  .beta  .beta  .gamma, .beta  .beta  .delta .alpha, .beta  .beta  .delta  .beta, .beta  .beta  .delta  .delta, .beta  .beta  .delta  .gamma, .beta  .beta  .gamma .alpha, .beta  .beta  .gamma  .beta, .beta  .beta  .gamma  .delta, .beta  .beta  .gamma  .gamma, .beta  .delta .alpha .alpha, .beta  .delta .alpha  .beta, .beta  .delta .alpha  .delta, .beta  .delta .alpha  .gamma, .beta  .delta  .beta .alpha, .beta  .delta  .beta  .beta, .beta  .delta  .beta  .delta, .beta  .delta  .beta  .gamma, .beta  .delta  .delta .alpha, .beta  .delta  .delta  .beta, .beta  .delta  .delta  .delta, .beta  .delta  .delta  .gamma, .beta  .delta  .gamma .alpha, .beta  .delta  .gamma  .beta, .beta  .delta  .gamma  .delta, .beta  .delta  .gamma  .gamma, .beta  .gamma .alpha .alpha, .beta  .gamma .alpha  .beta, .beta  .gamma .alpha  .delta, .beta  .gamma .alpha  .gamma, .beta  .gamma  .beta .alpha, .beta  .gamma  .beta  .beta, .beta  .gamma  .beta  .delta, .beta  .gamma  .beta  .gamma, .beta  .gamma  .delta .alpha, .beta  .gamma  .delta  .beta, .beta  .gamma  .delta  .delta, .beta  .gamma  .delta  .gamma, .beta  .gamma  .gamma .alpha, .beta  .gamma  .gamma  .beta, .beta  .gamma  .gamma  .delta, .beta  .gamma  .gamma  .gamma, .delta .alpha .alpha .alpha, .delta .alpha .alpha  .beta, .delta .alpha .alpha  .delta, .delta .alpha .alpha  .gamma, .delta .alpha  .beta .alpha, .delta .alpha  .beta  .beta, .delta .alpha  .beta  .delta, .delta .alpha  .beta  .gamma, .delta .alpha  .delta .alpha, .delta .alpha  .delta  .beta, .delta .alpha  .delta  .delta, .delta .alpha  .delta  .gamma, .delta .alpha  .gamma .alpha, .delta .alpha  .gamma  .beta, .delta .alpha  .gamma  .delta, .delta .alpha  .gamma  .gamma, .delta  .beta .alpha .alpha, .delta  .beta .alpha  .beta, .delta  .beta .alpha  .delta, .delta  .beta .alpha  .gamma, .delta  .beta  .beta .alpha, .delta  .beta  .beta  .beta, .delta  .beta  .beta  .delta, .delta  .beta  .beta  .gamma, .delta  .beta  .delta .alpha, .delta  .beta  .delta  .beta, .delta  .beta  .delta  .delta, .delta  .beta  .delta  .gamma, .delta  .beta  .gamma .alpha, .delta  .beta  .gamma  .beta, .delta  .beta  .gamma  .delta, .delta  .beta  .gamma  .gamma, .delta  .delta .alpha .alpha, .delta  .delta .alpha  .beta, .delta  .delta .alpha  .delta, .delta  .delta .alpha  .gamma, .delta  .delta  .beta .alpha, .delta  .delta  .beta  .beta, .delta  .delta  .beta  .delta, .delta  .delta  .beta  .gamma, .delta  .delta  .delta .alpha, .delta  .delta  .delta  .beta, .delta  .delta  .delta  .delta, .delta  .delta  .delta  .gamma, .delta  .delta  .gamma .alpha, .delta  .delta  .gamma  .beta, .delta  .delta  .gamma  .delta, .delta  .delta  .gamma  .gamma, .delta  .gamma .alpha .alpha, .delta  .gamma .alpha  .beta, .delta  .gamma .alpha  .delta, .delta  .gamma .alpha  .gamma, .delta  .gamma  .beta .alpha, .delta  .gamma  .beta  .beta, .delta  .gamma  .beta  .delta, .delta  .gamma  .beta  .gamma, .delta  .gamma  .delta .alpha, .delta  .gamma  .delta  .beta, .delta  .gamma  .delta  .delta, .delta  .gamma  .delta  .gamma, .delta  .gamma  .gamma .alpha, .delta  .gamma  .gamma  .beta, .delta  .gamma  .gamma  .delta, .delta  .gamma  .gamma  .gamma, .gamma .alpha .alpha .alpha, .gamma .alpha .alpha  .beta, .gamma .alpha .alpha  .delta, .gamma .alpha .alpha  .gamma, .gamma .alpha  .beta .alpha, .gamma .alpha  .beta  .beta, .gamma .alpha  .beta  .delta, .gamma .alpha  .beta  .gamma, .gamma .alpha  .delta .alpha, .gamma .alpha  .delta  .beta, .gamma .alpha  .delta  .delta, .gamma .alpha  .delta  .gamma, .gamma .alpha  .gamma .alpha, .gamma .alpha  .gamma  .beta, .gamma .alpha  .gamma  .delta, .gamma .alpha  .gamma  .gamma, .gamma  .beta .alpha .alpha, .gamma  .beta .alpha  .beta, .gamma  .beta .alpha  .delta, .gamma  .beta .alpha  .gamma, .gamma  .beta  .beta .alpha, .gamma  .beta  .beta  .beta, .gamma  .beta  .beta  .delta, .gamma  .beta  .beta  .gamma, .gamma  .beta  .delta .alpha, .gamma  .beta  .delta  .beta, .gamma  .beta  .delta  .delta, .gamma  .beta  .delta  .gamma, .gamma  .beta  .gamma .alpha, .gamma  .beta  .gamma  .beta, .gamma  .beta  .gamma  .delta, .gamma  .beta  .gamma  .gamma, .gamma  .delta .alpha .alpha, .gamma  .delta .alpha  .beta, .gamma  .delta .alpha  .delta, .gamma  .delta .alpha  .gamma, .gamma  .delta  .beta .alpha, .gamma  .delta  .beta  .beta, .gamma  .delta  .beta  .delta, .gamma  .delta  .beta  .gamma, .gamma  .delta  .delta .alpha, .gamma  .delta  .delta  .beta, .gamma  .delta  .delta  .delta, .gamma  .delta  .delta  .gamma, .gamma  .delta  .gamma .alpha, .gamma  .delta  .gamma  .beta, .gamma  .delta  .gamma  .delta, .gamma  .delta  .gamma  .gamma, .gamma  .gamma .alpha .alpha, .gamma  .gamma .alpha  .beta, .gamma  .gamma .alpha  .delta, .gamma  .gamma .alpha  .gamma, .gamma  .gamma  .beta .alpha, .gamma  .gamma  .beta  .beta, .gamma  .gamma  .beta  .delta, .gamma  .gamma  .beta  .gamma, .gamma  .gamma  .delta .alpha, .gamma  .gamma  .delta  .beta, .gamma  .gamma  .delta  .delta, .gamma  .gamma  .delta  .gamma, .gamma  .gamma  .gamma .alpha, .gamma  .gamma  .gamma  .beta, .gamma  .gamma  .gamma  .delta, .gamma  .gamma  .gamma  .gamma',
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
