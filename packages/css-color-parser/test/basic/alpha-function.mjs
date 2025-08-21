import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';
import { canonicalize } from '../util/canonical.mjs';

const tests = [
	['alpha(from red)', canonicalize('rgb(255 0 0)')],
	['alpha(from red / 0.5)', canonicalize('rgb(255 0 0 / 0.5)')],

	['alpha(from oklch(1 0.3 30deg) / 0.5)', canonicalize('oklch(1 0.3 30deg / 0.5)')],
	['alpha(from oklch(1 0.3 30deg) / alpha)', canonicalize('oklch(1 0.3 30deg)')],
	['alpha(from oklch(1 0.3 30deg) / calc(alpha / 4))', canonicalize('oklch(1 0.3 30deg / 0.25)')],

	['alpha(from lab(50% 40% 30%) / alpha)', canonicalize('lab(50% 40% 30%)')],
	['alpha(from lab(50% 40% 30% / 0.2))', canonicalize('lab(50% 40% 30% / 0.2)')],
	['alpha(from lab(50% 40% 30% / 0.2) / alpha)', canonicalize('lab(50% 40% 30% / 0.2)')],
	['alpha(from lab(50% 40% 30% / 0.2) / none)', 'rgba(201, 76, 58, none)'],

	['alpha(from lab(50% 40% 30% / 0.2) / var(--foo, alpha))', canonicalize('lab(50% 40% 30% / var(--foo, 0.2))')],

	['alpha(red)', ''],
	['alpha(red / 0.1)', ''],
	['alpha(red / )', ''],
	['alpha(/ 0.1)', ''],
	['alpha(0.1)', ''],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);
}
