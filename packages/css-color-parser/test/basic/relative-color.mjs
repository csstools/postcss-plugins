import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';
import { canonicalize } from '../util/canonical.mjs';

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from indianred 255 G b)'))),
	'rgb(255, 92, 92)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgba(from indianred 255 G b)'))),
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
	serialize_sRGB_data(color(parse('hsl(from rebeccapurple calc(h - 10) s l)'))),
	'rgb(85, 51, 153)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rebeccapurple h calc(s - 1) l)'))),
	'rgb(102, 52, 152)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('hsl(from rebeccapurple h s calc(l - 1))'))),
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

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('color(from red xyz x y z)'))),
	'rgb(255, 0, 0)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('color-mix(in hsl, hsl(from hsl(none 50% 50%) h s l), hsl(50deg 50% 50%))'))),
	canonicalize('hsl(50deg 50% 50%)'),
);

assert.deepStrictEqual(
	color(parse('hsl(from hsl(none 50% 50%) h s l)')),
	{
		colorNotation: 'hsl',
		channels: [NaN, 50, 50],
		alpha: 1,
		syntaxFlags: new Set(['relative-color-syntax', 'has-number-values']),
	},
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('color-mix(in hsl, hsl(from hsl(none 50% 50%) calc(h) s l), hsl(50deg 50% 50%))'))),
	canonicalize('hsl(25deg 50% 50%)'),
);

assert.deepStrictEqual(
	color(parse('hsl(from hsl(none 50% 50%) calc(h) s l)')),
	{
		colorNotation: 'hsl',
		channels: [0, 50, 50],
		alpha: 1,
		syntaxFlags: new Set(['relative-color-syntax', 'has-number-values']),
	},
);

[
	['color(from color(srgb 0 1 0) srgb r g b)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 0) srgb r g b)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 0) srgb r g b)', 'rgb(0, 247, 79)'],
	['color(from color(a98-rgb 0 1 0) srgb r g b)', 'rgb(0, 232, 118)'],
	['color(from color(prophoto-rgb 0 1 0) srgb r g b)', 'rgb(0, 241, 129)'],
	['color(from color(rec2020 0 1 0) srgb r g b)', 'rgb(0, 237, 126)'],

	['color(from color(srgb 0 1 0) srgb-linear r g b)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 0) srgb-linear r g b)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 0) srgb-linear r g b)', 'rgb(0, 247, 79)'],
	['color(from color(a98-rgb 0 1 0) srgb-linear r g b)', 'rgb(0, 232, 118)'],
	['color(from color(prophoto-rgb 0 1 0) srgb-linear r g b)', 'rgb(0, 241, 129)'],
	['color(from color(rec2020 0 1 0) srgb-linear r g b)', 'rgb(0, 237, 126)'],

	['color(from color(srgb 0 1 0) display-p3 r g b)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 0) display-p3 r g b)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 0) display-p3 r g b)', 'rgb(0, 247, 79)'],
	['color(from color(a98-rgb 0 1 0) display-p3 r g b)', 'rgb(0, 232, 118)'],
	['color(from color(prophoto-rgb 0 1 0) display-p3 r g b)', 'rgb(0, 241, 129)'],
	['color(from color(rec2020 0 1 0) display-p3 r g b)', 'rgb(0, 237, 126)'],

	['color(from color(srgb 0 1 0) a98-rgb r g b)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 0) a98-rgb r g b)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 0) a98-rgb r g b)', 'rgb(0, 247, 79)'],
	['color(from color(a98-rgb 0 1 0) a98-rgb r g b)', 'rgb(0, 232, 118)'],
	['color(from color(prophoto-rgb 0 1 0) a98-rgb r g b)', 'rgb(0, 241, 129)'],
	['color(from color(rec2020 0 1 0) a98-rgb r g b)', 'rgb(0, 237, 126)'],

	['color(from color(srgb 0 1 0) prophoto-rgb r g b)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 0) prophoto-rgb r g b)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 0) prophoto-rgb r g b)', 'rgb(0, 247, 79)'],
	['color(from color(a98-rgb 0 1 0) prophoto-rgb r g b)', 'rgb(0, 232, 118)'],
	['color(from color(prophoto-rgb 0 1 0) prophoto-rgb r g b)', 'rgb(0, 241, 129)'],
	['color(from color(rec2020 0 1 0) prophoto-rgb r g b)', 'rgb(0, 237, 126)'],

	['color(from color(srgb 0 1 0) rec2020 r g b)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 0) rec2020 r g b)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 0) rec2020 r g b)', 'rgb(0, 247, 79)'],
	['color(from color(a98-rgb 0 1 0) rec2020 r g b)', 'rgb(0, 232, 118)'],
	['color(from color(prophoto-rgb 0 1 0) rec2020 r g b)', 'rgb(0, 241, 129)'],
	['color(from color(rec2020 0 1 0) rec2020 r g b)', 'rgb(0, 237, 126)'],

	// None : 1
	['color(from color(srgb 0 1 none) srgb r g b)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 none) srgb r g b)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 none) srgb r g b)', 'rgb(0, 247, 106)'],
	['color(from color(a98-rgb 0 1 none) srgb r g b)', 'rgb(0, 232, 127)'],
	['color(from color(prophoto-rgb 0 1 none) srgb r g b)', 'rgb(0, 242, 153)'],
	['color(from color(rec2020 0 1 none) srgb r g b)', 'rgb(0, 238, 143)'],

	['color(from color(srgb 0 1 none) srgb-linear r g b)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 none) srgb-linear r g b)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 none) srgb-linear r g b)', 'rgb(0, 247, 106)'],
	['color(from color(a98-rgb 0 1 none) srgb-linear r g b)', 'rgb(0, 232, 127)'],
	['color(from color(prophoto-rgb 0 1 none) srgb-linear r g b)', 'rgb(0, 242, 153)'],
	['color(from color(rec2020 0 1 none) srgb-linear r g b)', 'rgb(0, 238, 143)'],

	['color(from color(srgb 0 1 none) display-p3 r g b)', 'rgb(84, 250, 0)'],
	['color(from color(srgb-linear 0 1 none) display-p3 r g b)', 'rgb(84, 250, 0)'],
	['color(from color(display-p3 0 1 none) display-p3 r g b)', 'rgb(0, 247, 79)'],
	['color(from color(a98-rgb 0 1 none) display-p3 r g b)', 'rgb(0, 232, 111)'],
	['color(from color(prophoto-rgb 0 1 none) display-p3 r g b)', 'rgb(0, 241, 141)'],
	['color(from color(rec2020 0 1 none) display-p3 r g b)', 'rgb(0, 237, 130)'],

	['color(from color(srgb 0 1 none) a98-rgb r g b)', 'rgb(63, 252, 0)'],
	['color(from color(srgb-linear 0 1 none) a98-rgb r g b)', 'rgb(63, 252, 0)'],
	['color(from color(display-p3 0 1 none) a98-rgb r g b)', 'rgb(0, 247, 92)'],
	['color(from color(a98-rgb 0 1 none) a98-rgb r g b)', 'rgb(0, 232, 118)'],
	['color(from color(prophoto-rgb 0 1 none) a98-rgb r g b)', 'rgb(0, 242, 146)'],
	['color(from color(rec2020 0 1 none) a98-rgb r g b)', 'rgb(0, 238, 136)'],

	// None : 2
	['color(from color(srgb 0 1 0) srgb r g none)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 0) srgb r g none)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 0) srgb r g none)', 'rgb(0, 247, 106)'],
	['color(from color(a98-rgb 0 1 0) srgb r g none)', 'rgb(0, 232, 127)'],
	['color(from color(prophoto-rgb 0 1 0) srgb r g none)', 'rgb(0, 242, 153)'],
	['color(from color(rec2020 0 1 0) srgb r g none)', 'rgb(0, 238, 143)'],

	['color(from color(srgb 0 1 0) srgb-linear r g none)', 'rgb(0, 255, 0)'],
	['color(from color(srgb-linear 0 1 0) srgb-linear r g none)', 'rgb(0, 255, 0)'],
	['color(from color(display-p3 0 1 0) srgb-linear r g none)', 'rgb(0, 247, 106)'],
	['color(from color(a98-rgb 0 1 0) srgb-linear r g none)', 'rgb(0, 232, 127)'],
	['color(from color(prophoto-rgb 0 1 0) srgb-linear r g none)', 'rgb(0, 242, 153)'],
	['color(from color(rec2020 0 1 0) srgb-linear r g none)', 'rgb(0, 238, 143)'],

	['color(from color(srgb 0 1 0) display-p3 r g none)', 'rgb(84, 250, 0)'],
	['color(from color(srgb-linear 0 1 0) display-p3 r g none)', 'rgb(84, 250, 0)'],
	['color(from color(display-p3 0 1 0) display-p3 r g none)', 'rgb(0, 247, 79)'],
	['color(from color(a98-rgb 0 1 0) display-p3 r g none)', 'rgb(0, 232, 111)'],
	['color(from color(prophoto-rgb 0 1 0) display-p3 r g none)', 'rgb(0, 241, 141)'],
	['color(from color(rec2020 0 1 0) display-p3 r g none)', 'rgb(0, 237, 130)'],

	// clipping of components (or lack thereof)
	['hsl(from lab(0 104.3 -50.9) h s l)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['hsl(from lab(0 104.3 -50.9) h calc(s) l)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['hsl(from lab(0 104.3 -50.9) h s l)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['hsl(305.510247383001deg 411.27657550111127% 6.872314424171214%)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['hsl(305.510247383001deg calc(411.27657550111127%) 6.872314424171214%)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['hsl(from lab(100 104.3 -50.9) 305.510247383001deg 411.27657550111127% 6.872314424171214%)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['hsl(from white 305.510247383001deg 411.27657550111127% 6.872314424171214%)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['hsl(from white 305.510247383001deg calc(411.27657550111127%) 6.872314424171214%)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['hsl(from white 305.510247383001deg calc(s + 411.27657550111127) 6.872314424171214%)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
].forEach(([input, expected]) => {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(input))),
		expected,
		`${input}: ${expected}`,
	);
});
