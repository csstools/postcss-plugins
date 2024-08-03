import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data, serialize_P3_data } from '../util/serialize.mjs';

const tests = [
	['lch(46.2775% 67.9892 134.3912)', 'rgb(0, 128, 0)', 'color(display-p3 0.21595 0.49419 0.13153)'],
	['lch(0% 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lch(100% 0 0)', 'rgb(255, 255, 255)', 'color(display-p3 1 1 1)'],
	['lch(50% 50 0)', 'rgb(193, 78, 121)', 'color(display-p3 0.70225 0.33296 0.47259)'],
	['lch(70% 45 -180)', 'rgb(27, 193, 169)', 'color(display-p3 0.35511 0.7445 0.66623)'],
	['lch(70% 70 90)', 'rgb(195, 169, 14)', 'color(display-p3 0.74935 0.66735 0.2273)'],
	['lch(55% 60 270)', 'rgb(33, 135, 237)', 'color(display-p3 0.26152 0.52336 0.89912)'],
	['lch(86.6146% 148.1135 136.0089)', 'rgb(0, 247, 79)', 'color(display-p3 0 0.99999 0.00123)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);

	assert.deepStrictEqual(
		serialize_P3_data(color(parse(test[0]))),
		test[2],
		`"${test[0]}" : ${test[2]}`,
	);
}
