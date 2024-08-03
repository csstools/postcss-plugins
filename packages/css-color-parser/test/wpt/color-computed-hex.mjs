import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['#fff', 'rgb(255, 255, 255)', 'Valid 3-digit hex'],
	['#ffff', 'rgb(255, 255, 255)', 'Valid 4-digit hex'],
	['#ffffff', 'rgb(255, 255, 255)', 'Valid 6-digit hex'],
	['#ffffffff', 'rgb(255, 255, 255)', 'Valid 8-digit hex'],
	['#FFCc99', 'rgb(255, 204, 153)', 'Valid 6-digit hex'],
	['#369', 'rgb(51, 102, 153)', 'Valid 3-digit hex'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
	);
}
