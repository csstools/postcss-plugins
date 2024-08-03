import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['#', 'Should not parse invalid hex'],
	['#f', 'Should not parse invalid hex'],
	['#ff', 'Should not parse invalid hex'],
	['#ffg', 'Should not parse invalid hex'],
	['#fffg', 'Should not parse invalid hex'],
	['#fffff', 'Should not parse invalid hex'],
	['#fffffg', 'Should not parse invalid hex'],
	['#fffffff', 'Should not parse invalid hex'],
	['#fffffffg', 'Should not parse invalid hex'],
	['#fffffffff', 'Should not parse invalid hex'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		'',
	);
}
