import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from indianred 255 G b)'))),
	'rgb(255, 92, 92)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(50 50 50 / 0.5) 30 30 30)'))),
	'rgba(30, 30, 30, 0.5)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(50 50 50 / 0.5) 30 30 30 / 0.7)'))),
	'rgba(30, 30, 30, 0.7)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(50 50 50 / 0.3) 30 30 30 / alpha)'))),
	'rgba(30, 30, 30, 0.3)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(50 50 50 / 50%) 30 30 30)'))),
	'rgba(30, 30, 30, 0.5)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(50 50 50 / 50%) 30 30 30 / 70%)'))),
	'rgba(30, 30, 30, 0.7)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(50 50 50 / 30%) 30 30 30 / alpha)'))),
	'rgba(30, 30, 30, 0.3)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rebeccapurple h s l)'))),
	'rgb(102, 51, 153)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rebeccapurple calc(h - 10deg) s l)'))),
	'rgb(85, 51, 153)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rebeccapurple h calc(s - 1%) l)'))),
	'rgb(102, 52, 152)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rebeccapurple h s calc(l - 1%))'))),
	'rgb(99, 50, 149)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rebeccapurple calc(h)calc(s)calc(l))'))),
	'rgb(102, 51, 153)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple calc(r + 1) calc(g + 1) calc(b + 1))'))),
	'rgb(103, 52, 154)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple calc(r + 0.1) calc(g + 0.1) calc(b + 0.1))'))),
	'rgb(102, 51, 153)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('color(from rebeccapurple srgb calc(r + 1) calc(g + 1) calc(b + 1))'))),
	'rgb(255, 255, 255)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('color(from rebeccapurple srgb calc(r + 0.1) calc(g + 0.1) calc(b + 0.1))'))),
	'rgb(128, 77, 179)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rgb(50 50 50 / calc(10px + 10)) h s l)'))),
	'',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rgb(50 50 50 / var(--foo)) h s l)'))),
	'',
);
