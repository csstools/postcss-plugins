import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	// Test parse-time clamp of negative saturation to zero
	['hsl(0 -50% 40%)', 'rgb(102, 102, 102)'],
	['hsl(30 -50% 60)', 'rgb(153, 153, 153)'],
	['hsl(0 -50 40%)', 'rgb(102, 102, 102)'],
	['hsl(30 -50 60)', 'rgb(153, 153, 153)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
	);
}
