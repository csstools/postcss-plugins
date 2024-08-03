import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hwb(90deg 25% 25%)'))),
	'rgb(128, 191, 64)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hwb(90deg 25 25)'))),
	'rgb(128, 191, 64)',
);
