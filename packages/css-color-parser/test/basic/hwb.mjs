import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_P3_data, serialize_sRGB_data } from '../util/serialize.mjs';

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hwb(90deg 25% 25%)'))),
	'rgb(128, 191, 64)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hwb(90deg 25 25)'))),
	'rgb(128, 191, 64)',
);

assert.deepStrictEqual(
	serialize_P3_data(color(parse('hwb(from color(srgb 1.59343 0.58802 1.40564) h w b / alpha)')), false),
	'color(display-p3 1.47868 0.65877 1.37065)',
);

assert.deepStrictEqual(
	serialize_P3_data(color(parse('hwb(from lab(100 104.3 -50.9) h w b)')), false),
	'color(display-p3 1.47874 0.65856 1.37055)',
);
