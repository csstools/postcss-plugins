import { color, computedValue } from '@csstools/css-color-parser';
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

// `W` and `B` are not clamped, values outside the `[0, 100]` range are not invalid.
assert.deepStrictEqual(
	computedValue(color(parse('hwb(0 -10% 50%)')), false),
	'hwb(0 -10% 50%)',
);

assert.deepStrictEqual(
	computedValue(color(parse('hwb(0 50% -10%)')), false),
	'hwb(0 50% -10%)',
);

// The hue is only powerless when the raw sum of `W` and `B` is `>= 99.999`.
assert.deepStrictEqual(
	computedValue(color(parse('color-mix(in hwb, color(srgb -0.1 -0.1 0))')), false),
	'hwb(240 -10% 100%)',
);

assert.deepStrictEqual(
	computedValue(color(parse('color-mix(in hwb, color(srgb -0.1 -0.1 -0.1))')), false),
	'hwb(none -10% 110%)',
);

// Both `W` and `B` can be negative after conversion from an out-of-gamut color.
assert.deepStrictEqual(
	computedValue(color(parse('color-mix(in hwb, color(srgb 2 -1 0.5))')), false),
	'hwb(330 -100% -100%)',
);

assert.deepStrictEqual(
	computedValue(color(parse('color-mix(in hwb, color(display-p3 0 1 0))')), false),
	'hwb(127.88028828 -51.16049826% -1.82656579%)',
);

assert.deepStrictEqual(
	computedValue(color(parse('color(from hwb(30deg 100% -10%) srgb r g b)')), false),
	'color(srgb 1.1 1.05 0.9999999999999999)',
);

assert.deepStrictEqual(
	computedValue(color(parse('color(from hwb(30deg 110% -10%) srgb r g b)')), false),
	'color(srgb 1.1000000000000003 1.0999999999999999 1.1)',
);
