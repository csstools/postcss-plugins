import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	// Testing invalid values
	['rgb(from rebeccapurple r 10deg 10)'],
	['rgb(from rebeccapurple r 10 10deg)'],
	['rgb(from rebeccapurple 10deg g b)'],
	['rgb(from rgb(10%, 20%, 30%, 40%) r 10deg 10)'],
	['rgb(from rgb(10%, 20%, 30%, 40%) r 10 10deg)'],
	['rgb(from rgb(10%, 20%, 30%, 40%) 10deg g b)'],

	// Testing invalid component names
	['rgb(from rebeccapurple red g b)'],
	['rgb(from rebeccapurple l g b)'],
	['rgb(from rebeccapurple h g b)'],

	// Testing invalid function name variation (only rgb() is valid, rgba() is invalid)
	['rgba(from rebeccapurple r g b)'],
	['rgba(from rgb(10%, 20%, 30%, 40%) r g b / alpha)'],


	// hsl(from ...)

	// Testing invalid permutation (types don't match).
	['hsl(from rebeccapurple s h l)'],
	['hsl(from rebeccapurple s s s / s)'],
	['hsl(from rgb(10%, 20%, 30%, 40%) s h l)'],
	['hsl(from rgb(10%, 20%, 30%, 40%) s s s / s)'],

	// Testing invalid values.
	['hsl(from rebeccapurple 10% s l)'],
	['hsl(from rgb(10%, 20%, 30%, 40%) 10% s l)'],

	// Testing invalid component names
	['hsl(from rebeccapurple hue s l)'],
	['hsl(from rebeccapurple x s l)'],
	['hsl(from rebeccapurple h g b)'],

	// Testing invalid function name variation (only hsl() is valid, hsla() is invalid)
	['hsla(from rebeccapurple h s l)'],
	['hsla(from rgb(10%, 20%, 30%, 40%) h s l / alpha)'],

	// hwb(from ...)

	// Testing invalid permutation (types don't match).
	['hwb(from rebeccapurple w h b)'],
	['hwb(from rebeccapurple b b b / b)'],
	['hwb(from rgb(10%, 20%, 30%, 40%) w b h)'],
	['hwb(from rgb(10%, 20%, 30%, 40%) b b b / b)'],

	// Testing invalid values.
	['hwb(from rebeccapurple 10% w b)'],
	['hwb(from rgb(10%, 20%, 30%, 40%) 10% w b)'],

	// Testing invalid component names
	['hwb(from rebeccapurple hue w b)'],
	['hwb(from rebeccapurple x w b)'],
	['hwb(from rebeccapurple h g b)'],


	// Testing invalid values.
	['lab(from lab(.25 20 50) l 10deg 10)'],
	['lab(from lab(.25 20 50) l 10 10deg)'],
	['lab(from lab(.25 20 50) 10deg a b)'],
	['lab(from lab(.25 20 50 / 40%) l 10deg 10)'],
	['lab(from lab(.25 20 50 / 40%) l 10 10deg)'],
	['lab(from lab(.25 20 50 / 40%) 10deg a b)'],

	// Testing invalid component names
	['lab(from lab(.25 20 50) lightness a b)'],
	['lab(from lab(.25 20 50) x a b)'],
	['lab(from lab(.25 20 50) h g b)'],



	// Testing invalid values.
	['lch(from lch(.70 45 30) l 10deg h)'],
	['lch(from lch(.70 45 30) l c 10%)'],
	['lch(from lch(.70 45 30) 10deg c h)'],
	['lch(from lch(.70 45 30 / 40%) l 10deg h)'],
	['lch(from lch(.70 45 30 / 40%) l c 10%)'],
	['lch(from lch(.70 45 30 / 40%) 10deg c h)'],

	// Testing invalid component names
	['lch(from lch(.70 45 30) lightness c h)'],
	['lch(from lch(.70 45 30) x c h)'],
	['lch(from lch(.70 45 30) l g b)'],



	// Testing invalid values.
	['color(from color(srgb 0.7 0.5 0.3) srgb 10deg g b)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r 10deg b)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g 10deg)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g b / 10deg)'],

	// Testing invalid component names
	['color(from color(srgb 0.7 0.5 0.3) srgb red g b)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb x g b)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb l g b)'],

	// Testing invalid values.
	['color(from color(xyz 7 -20.5 100) xyz 10deg y z)'],
	['color(from color(xyz 7 -20.5 100) xyz x 10deg z)'],
	['color(from color(xyz 7 -20.5 100) xyz x y 10deg)'],
	['color(from color(xyz 7 -20.5 100) xyz x y z / 10deg)'],

	// Testing invalid component names
	['color(from color(xyz 7 -20.5 100) xyz red y)'],
	['color(from color(xyz 7 -20.5 100) xyz r y z)'],
	['color(from color(xyz 7 -20.5 100) xyz l y z)'],

];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		'',
		test[0],
	);
}
