import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['hwba(120 30% 50%)'],
	['hwba(120 30% 50% / 0.5)'],

	['hwb(90deg, 50%, 50%)', 'HWB value with commas should not be parsed'],
	['hwb(90deg, 50%, 50%, 0.2)', 'HWB value with commas should not be parsed'],
	['hwb(90, 50%, 50%)', 'HWB value with commas should not be parsed'],
	['hwb(90, 50%, 50%, 0.2)', 'HWB value with commas should not be parsed'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		'',
	);
}
