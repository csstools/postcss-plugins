import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_OKLCH_data } from '../util/serialize.mjs';

const tests = [
	['color-mix(in oklch, oklch(100% 0% 60deg), oklch(50% 50% 0deg))', 'oklch(0.75 0.1 0)'],
	['color-mix(in oklch, rgb(255, 255, 255), rgb(180, 6, 95))', 'oklch(0.75031 0.10016 359.858)'],
	['color-mix(in lch, oklch(75% 0% 60deg), oklch(75% 50% 0deg))', 'oklch(0.74979 0.09824 0.10588)'],
	['color-mix(in oklch, oklch(100% 0% none), oklch(50% 50% 0deg))', 'oklch(0.75 0.1 0)'],
	['color-mix(in oklch, oklch(100% none 60deg), oklch(50% 50% 0deg))', 'oklch(0.75 0.2 30)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_OKLCH_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);
}
