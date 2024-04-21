import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('lab(46.2775% -47.5621 48.5837)'))),
	'rgb(0, 128, 0)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('lab(0% 0 0)'))),
	'rgb(0, 0, 0)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('lab(100% 0 0)'))),
	'rgb(255, 255, 255)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('lab(50% 50 0)'))),
	'rgb(193, 78, 121)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('lab(70% -45 0)'))),
	'rgb(27, 193, 169)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('lab(70% 0 70)'))),
	'rgb(195, 169, 14)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('lab(55% 0 -60)'))),
	'rgb(33, 135, 237)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('lab(86.6146% -106.5599 102.8717)'))),
	'rgb(0, 247, 79)',
);

assert.deepStrictEqual(
	color(parse('lab(55% 0 -60)')),
	{
		colorNotation: 'lab',
		channels: [55, 0, -60],
		alpha: 1,
		syntaxFlags: new Set(['has-percentage-values', 'has-number-values']),
	},
);
