import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

// Testing no modifications.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g b)'))),
	'rgb(102, 51, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g b / alpha)'))),
	'rgb(102, 51, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r g b / alpha)'))),
	'rgba(51, 102, 153, 0.8)',
);
// TODO
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from hsl(120deg 20% 50% / .5) r g b / alpha)'))),
// 	'rgba(102, 153, 102, 0.5)',
// );

// Test nesting relative colors.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(from rebeccapurple r g b) r g b)'))),
	'rgb(102, 51, 153)',
);

// // Testing non-sRGB origin colors to see gamut mapping.
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from color(display-p3 0 1 0) r g b / alpha)'))),
// 	'rgb(0, 249, 66)',
// ); // Naive clip based mapping would give rgb(0, 255, 0).
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from lab(100 104.3 -50.9) r g b)'))),
// 	'rgb(255, 255, 255)',
// ); // Naive clip based mapping would give rgb(255, 150, 255).
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from lab(0 104.3 -50.9) r g b)'))),
// 	'rgb(42, 0, 34)',
// ); // Naive clip based mapping would give rgb(90, 0, 76). NOTE: 0% lightness in Lab/LCH does not automatically correspond with sRGB black,
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from lch(100 116 334) r g b)'))),
// 	'rgb(255, 255, 255)',
// ); // Naive clip based mapping would give rgb(255, 150, 255).
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from lch(0 116 334) r g b)'))),
// 	'rgb(42, 0, 34)',
// ); // Naive clip based mapping would give rgb(90, 0, 76). NOTE: 0% lightness in Lab/LCH does not automatically correspond with sRGB black,
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from oklab(100 0.365 -0.16) r g b)'))),
// 	'rgb(255, 255, 255)',
// ); // Naive clip based mapping would give rgb(255, 92, 255).
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from oklab(0 0.365 -0.16) r g b)'))),
// 	'rgb(0, 0, 0)',
// ); // Naive clip based mapping would give rgb(19, 0, 24).
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from oklch(100 0.399 336.3) r g b)'))),
// 	'rgb(255, 255, 255)',
// ); // Naive clip based mapping would give rgb(255, 91, 255).
// assert.deepStrictEqual(
// 	serialize_sRGB_data(color(parse('rgb(from oklch(0 0.399 336.3) r g b)'))),
// 	'rgb(0, 0, 0)',
// ); // Naive clip based mapping would give rgb(20, 0, 24).

// Testing replacement with 0.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple 0 0 0)'))),
	'rgb(0, 0, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple 0 0 0 / 0)'))),
	'rgba(0, 0, 0, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple 0 g b / alpha)'))),
	'rgb(0, 51, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r 0 b / alpha)'))),
	'rgb(102, 0, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g 0 / alpha)'))),
	'rgb(102, 51, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g b / 0)'))),
	'rgba(102, 51, 153, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) 0 g b / alpha)'))),
	'rgba(0, 102, 153, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r 0 b / alpha)'))),
	'rgba(51, 0, 153, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r g 0 / alpha)'))),
	'rgba(51, 102, 0, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r g b / 0)'))),
	'rgba(51, 102, 153, 0)',
);

// Testing replacement with a number.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple 25 g b / alpha)'))),
	'rgb(25, 51, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r 25 b / alpha)'))),
	'rgb(102, 25, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g 25 / alpha)'))),
	'rgb(102, 51, 25)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g b / .25)'))),
	'rgba(102, 51, 153, 0.25)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) 25 g b / alpha)'))),
	'rgba(25, 102, 153, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r 25 b / alpha)'))),
	'rgba(51, 25, 153, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r g 25 / alpha)'))),
	'rgba(51, 102, 25, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r g b / .20)'))),
	'rgba(51, 102, 153, 0.2)',
);

// Testing replacement with a percentage.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple 20% g b / alpha)'))),
	'rgb(51, 51, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r 20% b / alpha)'))),
	'rgb(102, 51, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g 20% / alpha)'))),
	'rgb(102, 51, 51)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g b / 20%)'))),
	'rgba(102, 51, 153, 0.2)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) 20% g b / alpha)'))),
	'rgba(51, 102, 153, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r 20% b / alpha)'))),
	'rgba(51, 51, 153, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r g 20% / alpha)'))),
	'rgba(51, 102, 51, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r g b / 20%)'))),
	'rgba(51, 102, 153, 0.2)',
);

// Testing replacement with a number for r, g, b but percent for alpha.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple 25 g b / 25%)'))),
	'rgba(25, 51, 153, 0.25)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r 25 b / 25%)'))),
	'rgba(102, 25, 153, 0.25)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g 25 / 25%)'))),
	'rgba(102, 51, 25, 0.25)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) 25 g b / 25%)'))),
	'rgba(25, 102, 153, 0.25)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r 25 b / 25%)'))),
	'rgba(51, 25, 153, 0.25)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r g 25 / 25%)'))),
	'rgba(51, 102, 25, 0.25)',
);

// Testing permutation.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple g b r)'))),
	'rgb(51, 153, 102)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple b alpha r / g)'))),
	'rgba(153, 255, 102, 0.2)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r r r / r)'))),
	'rgba(102, 102, 102, 0.4)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple alpha alpha alpha / alpha)'))),
	'rgb(255, 255, 255)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) g b r)'))),
	'rgb(102, 153, 51)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) b alpha r / g)'))),
	'rgba(153, 204, 51, 0.4)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r r r / r)'))),
	'rgba(51, 51, 51, 0.2)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) alpha alpha alpha / alpha)'))),
	'rgba(204, 204, 204, 0.8)',
);

// Testing mixes of number and percentage. (These would not be allowed in the non-relative syntax).
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r 20% 10)'))),
	'rgb(102, 51, 10)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r 10 20%)'))),
	'rgb(102, 10, 51)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple 0% 10 10)'))),
	'rgb(0, 10, 10)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r 20% 10)'))),
	'rgb(51, 51, 10)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) r 10 20%)'))),
	'rgb(51, 10, 51)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) 0% 10 10)'))),
	'rgb(0, 10, 10)',
);

// r    g    b
// 102  51   153
// 40%  20%  60%)
// Testing with calc().
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple calc(r) calc(g) calc(b))'))),
	'rgb(102, 51, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r calc(g * 2) 10)'))),
	'rgb(102, 102, 10)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple b calc(r * .5) 10)'))),
	'rgb(153, 51, 10)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r calc(g * .5 + g * .5) 10)'))),
	'rgb(102, 51, 10)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r calc(b * .5 - g * .5) 10)'))),
	'rgb(102, 51, 10)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20%, 40%, 60%, 80%) calc(r) calc(g) calc(b) / calc(alpha))'))),
	'rgba(51, 102, 153, 0.8)',
);

// Testing with 'none'.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple none none none)'))),
	'rgb(0, 0, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple none none none / none)'))),
	'rgba(0, 0, 0, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g none)'))),
	'rgb(102, 51, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g none / alpha)'))),
	'rgb(102, 51, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rebeccapurple r g b / none)'))),
	'rgba(102, 51, 153, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20% 40% 60% / 80%) r g none / alpha)'))),
	'rgba(51, 102, 0, 0.8)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20% 40% 60% / 80%) r g b / none)'))),
	'rgba(51, 102, 153, 0)',
);
// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(none none none) r g b)'))),
	'rgb(0, 0, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(none none none / none) r g b / alpha)'))),
	'rgba(0, 0, 0, 0)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20% none 60%) r g b)'))),
	'rgb(51, 0, 153)',
);
assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(from rgb(20% 40% 60% / none) r g b / alpha)'))),
	'rgba(51, 102, 153, 0)',
);
