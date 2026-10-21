import assert from 'node:assert';
import { reducePrecisionWholeValue } from '../util/serialize.mjs';
import { color, computedValue } from '@csstools/css-color-parser';
import { parse } from '../util/parse.mjs';

{
	const tests = [
		['lch(from color(display-p3 0.1893689 0.18937814 0.18937561) l c h)', 'lch(19.99999973 0 none)'],
		['color-mix(in lch, color(display-p3 0.1893689 0.18937814 0.18937561), lch(11 33 44))', 'lch(15.49999987 16.5 44)'],
		['color-mix(in lch, color(display-p3 0.1893689 0.18937814 0.18937561))', 'lch(19.99999973 0 none)'],
		['oklch(from color(display-p3 0.08610937692934956 0.08610188202042188 0.08610387292083356) l c h)', 'oklch(0.2 0.000004 359.99999992)'],
		['color-mix(in oklch, color(display-p3 0.08610937692934956 0.08610188202042188 0.08610387292083356), oklch(0.11 0.33 0.44))', 'oklch(0.155 0.165002 0.21999996)'],
		['color-mix(in oklch, color(display-p3 0.08610937692934956 0.08610188202042188 0.08610387292083356))', 'oklch(0.2 0.000004 359.99999992)'],
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			reducePrecisionWholeValue(computedValue(color(parse(test[0])))),
			test[1],
			`"${test[0]}" : ${test[1]}`,
		);
	}
}
