import assert from 'node:assert';
import { computedValue, reducePrecisionWholeValue } from '../util/serialize.mjs';

{
	const tests = [
		// exhaustive tests
		// HSL
		['hsl(from hsl(0 50% 50%) h s l)', 'color(srgb 0.75 0.25 0.25)'],
		['hsl(from hsl(180 0 50%) h s l)', 'hsl(none 0% 50%)'],
		['hsl(from hsl(180 50% 0) h s l)', 'color(srgb 0 0 0)'],
		['hsl(from hsl(0 0 50%) h s l)', 'hsl(none 0% 50%)'],
		['hsl(from hsl(180 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from hsl(0 50% 0) h s l)', 'color(srgb 0 0 0)'],
		['hsl(from hsl(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from hwb(0 25% 25%) h s l)', 'color(srgb 0.75 0.25 0.25)'],
		['hsl(from hwb(180 100% 25%) h s l)', 'hsl(none 0% 80%)'],
		['hsl(from hwb(180 25% 100%) h s l)', 'hsl(none 0% 20%)'],
		['hsl(from hwb(0 100% 25%) h s l)', 'hsl(none 0% 80%)'],
		['hsl(from hwb(180 100% 100%) h s l)', 'hsl(none 0% 50%)'],
		['hsl(from hwb(0 25% 100%) h s l)', 'hsl(none 0% 20%)'],
		['hsl(from hwb(0 100% 100%) h s l)', 'hsl(none 0% 50%)'],

		['hsl(from lch(0 20 180) h s l)', 'color(srgb -0.13099833 0.05952886 -0.00460494)'],
		['hsl(from lch(20 0 180) h s l)', 'hsl(none 0% 18.93757452%)'],
		['hsl(from lch(20 20 0) h s l)', 'color(srgb 0.2923664 0.14058899 0.19244775)'],
		['hsl(from lch(0 0 180) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from lch(20 0 0) h s l)', 'hsl(none 0% 18.93757452%)'],
		['hsl(from lch(0 20 0) h s l)', 'color(srgb 0.13099833 -0.05952886 0.00460494)'],
		['hsl(from lch(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from oklch(0 0.2 180) h s l)', 'color(srgb -0.0266189 0.00845442 0.00006795)'],
		['hsl(from oklch(0.2 0 180) h s l)', 'hsl(none 0% 8.61042044%)'],
		['hsl(from oklch(0.2 0.2 0) h s l)', 'color(srgb 0.29595438 -0.12706564 0.07183401)'],
		['hsl(from oklch(0 0 180) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from oklch(0.2 0 0) h s l)', 'hsl(none 0% 8.61042044%)'],
		['hsl(from oklch(0 0.2 0) h s l)', 'color(srgb 0.0266189 -0.00845442 -0.00006795)'],
		['hsl(from oklch(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from rgb(0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from color(display-p3 0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from lab(0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from oklab(0 0 0) h s l)', 'hsl(none 0% 0%)'],


		// HWB
		['hwb(from hsl(0 50% 50%) h w b)', 'color(srgb 0.75 0.25 0.25)'],
		['hwb(from hsl(180 0 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 50% 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 0 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 50% 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from hwb(0 25% 25%) h w b)', 'color(srgb 0.75 0.25 0.25)'],
		['hwb(from hwb(180 100% 25%) h w b)', 'hwb(none 100% 25%)'],
		['hwb(from hwb(180 25% 100%) h w b)', 'hwb(none 25% 100%)'],
		['hwb(from hwb(0 100% 25%) h w b)', 'hwb(none 100% 25%)'],
		['hwb(from hwb(180 100% 100%) h w b)', 'hwb(none 100% 100%)'],
		['hwb(from hwb(0 25% 100%) h w b)', 'hwb(none 25% 100%)'],
		['hwb(from hwb(0 100% 100%) h w b)', 'hwb(none 100% 100%)'],

		['hwb(from lch(0 20 180) h w b)', 'color(srgb -0.13099833 0.05952886 -0.00460494)'],
		['hwb(from lch(20 0 180) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(20 20 0) h w b)', 'color(srgb 0.2923664 0.14058899 0.19244775)'],
		['hwb(from lch(0 0 180) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from lch(20 0 0) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(0 20 0) h w b)', 'color(srgb 0.13099833 -0.05952886 0.00460494)'],
		['hwb(from lch(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from oklch(0 0.2 180) h w b)', 'color(srgb -0.0266189 0.00845442 0.00006795)'],
		['hwb(from oklch(0.2 0 180) h w b)', 'hwb(none 8.61042044% 91.38957956%)'],
		['hwb(from oklch(0.2 0.2 0) h w b)', 'color(srgb 0.29595438 -0.12706564 0.07183401)'],
		['hwb(from oklch(0 0 180) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from oklch(0.2 0 0) h w b)', 'hwb(none 8.61042044% 91.38957956%)'],
		['hwb(from oklch(0 0.2 0) h w b)', 'color(srgb 0.0266189 -0.00845442 -0.00006795)'],
		['hwb(from oklch(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from rgb(0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from color(display-p3 0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from lab(0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from oklab(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		// LCH
		['lch(from hsl(0 50% 50%) l c h)', 'lch(46.42043661 59.74639249 29.95665674)'],
		['lch(from hsl(180 0 50%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hsl(180 50% 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 0 50%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hsl(180 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 50% 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 0 0) l c h)', 'lch(0 0 none)'],

		['lch(from hwb(0 25% 25%) l c h)', 'lch(46.42043661 59.74639249 29.95665674)'],
		['lch(from hwb(180 100% 25%) l c h)', 'lch(82.04578167 0 none)'],
		['lch(from hwb(180 25% 100%) l c h)', 'lch(21.24673129 0 none)'],
		['lch(from hwb(0 100% 25%) l c h)', 'lch(82.04578167 0 none)'],
		['lch(from hwb(180 100% 100%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hwb(0 25% 100%) l c h)', 'lch(21.24673129 0 none)'],
		['lch(from hwb(0 100% 100%) l c h)', 'lch(53.38896474 0 none)'],

		['lch(from lch(0 20 180) l c h)', 'lch(0 20 180)'],
		['lch(from lch(20 0 180) l c h)', 'lch(20 0 none)'],
		['lch(from lch(20 20 0) l c h)', 'lch(20 20 0)'],
		['lch(from lch(0 0 180) l c h)', 'lch(0 0 none)'],
		['lch(from lch(20 0 0) l c h)', 'lch(20 0 none)'],
		['lch(from lch(0 20 0) l c h)', 'lch(0 20 0)'],
		['lch(from lch(0 0 0) l c h)', 'lch(0 0 none)'],

		['lch(from oklch(0 0.2 180) l c h)', 'lch(0.00996014 2.6503948 181.20369565)'],
		['lch(from oklch(0.2 0 180) l c h)', 'lch(7.22637037 0 none)'],
		['lch(from oklch(0.2 0.2 0) l c h)', 'lch(5.10873217 59.48824051 1.24207317)'],
		['lch(from oklch(0 0 180) l c h)', 'lch(0 0 none)'],
		['lch(from oklch(0.2 0 0) l c h)', 'lch(7.22637037 0 none)'],
		['lch(from oklch(0 0.2 0) l c h)', 'lch(0 2.6503948 1.20369565)'],
		['lch(from oklch(0 0 0) l c h)', 'lch(0 0 none)'],

		['lch(from rgb(0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from color(display-p3 0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from lab(0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from oklab(0 0 0) l c h)', 'lch(0 0 none)'],

		// oklch
		['oklch(from hsl(0 50% 50%) l c h)', 'oklch(0.55233858 0.16366995 24.21253898)'],
		['oklch(from hsl(180 0 50%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hsl(180 50% 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 0 50%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hsl(180 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 50% 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 0 0) l c h)', 'oklch(0 0 none)'],

		['oklch(from hwb(0 25% 25%) l c h)', 'oklch(0.55233858 0.16366995 24.21253898)'],
		['oklch(from hwb(180 100% 25%) l c h)', 'oklch(0.84522226 0 none)'],
		['oklch(from hwb(180 25% 100%) l c h)', 'oklch(0.32109251 0 none)'],
		['oklch(from hwb(0 100% 25%) l c h)', 'oklch(0.84522226 0 none)'],
		['oklch(from hwb(180 100% 100%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hwb(0 25% 100%) l c h)', 'oklch(0.32109251 0 none)'],
		['oklch(from hwb(0 100% 100%) l c h)', 'oklch(0.59818073 0 none)'],

		['oklch(from lch(0 20 180) l c h)', 'oklch(0 0.26412556 175.27132911)'],
		['oklch(from lch(20 0 180) l c h)', 'oklch(0.31034483 0 none)'],
		['oklch(from lch(20 20 0) l c h)', 'oklch(0.31697196 0.06085528 359.39300302)'],
		['oklch(from lch(0 0 180) l c h)', 'oklch(0 0 none)'],
		['oklch(from lch(20 0 0) l c h)', 'oklch(0.31034483 0 none)'],
		['oklch(from lch(0 20 0) l c h)', 'oklch(0.05666101 0.26412556 355.27132911)'],
		['oklch(from lch(0 0 0) l c h)', 'oklch(0 0 none)'],

		['oklch(from oklch(0 0.2 180) l c h)', 'oklch(0 0.2 180)'],
		['oklch(from oklch(0.2 0 180) l c h)', 'oklch(0.2 0 none)'],
		['oklch(from oklch(0.2 0.2 0) l c h)', 'oklch(0.2 0.2 0)'],
		['oklch(from oklch(0 0 180) l c h)', 'oklch(0 0 none)'],
		['oklch(from oklch(0.2 0 0) l c h)', 'oklch(0.2 0 none)'],
		['oklch(from oklch(0 0.2 0) l c h)', 'oklch(0 0.2 0)'],
		['oklch(from oklch(0 0 0) l c h)', 'oklch(0 0 none)'],

		['oklch(from rgb(0 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from color(display-p3 0 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from lab(0 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from oklab(0 0 0) l c h)', 'oklch(0 0 none)'],


		// rgb
		['rgb(from rgb(0 50 100) r g b)', 'color(srgb 0 0.19607843 0.39215686)'],
		['rgb(from rgb(25 0 100) r g b)', 'color(srgb 0.09803922 0 0.39215686)'],
		['rgb(from rgb(25 50 0) r g b)', 'color(srgb 0.09803922 0.19607843 0)'],
		['rgb(from rgb(0 0 100) r g b)', 'color(srgb 0 0 0.39215686)'],
		['rgb(from rgb(25 0 0) r g b)', 'color(srgb 0.09803922 0 0)'],
		['rgb(from rgb(0 50 0) r g b)', 'color(srgb 0 0.19607843 0)'],
		['rgb(from rgb(0 0 0) r g b)', 'color(srgb 0 0 0)'],

		['rgb(from color(display-p3 0 0.5 1) r g b)', 'color(srgb -0.24307182 0.50960895 1.03498498)'],
		['rgb(from color(display-p3 0.25 0 1) r g b)', 'color(srgb 0.27690544 -0.02764484 1.0416057)'],
		['rgb(from color(display-p3 0.25 0.5 0) r g b)', 'color(srgb 0.12407597 0.50734577 -0.14204703)'],
		['rgb(from color(display-p3 0 0 1) r g b)', 'color(srgb 0 0 1.04202162)'],
		['rgb(from color(display-p3 0.25 0 0) r g b)', 'color(srgb 0.27690544 -0.02764484 -0.01290814)'],
		['rgb(from color(display-p3 0 0.5 0) r g b)', 'color(srgb -0.24307182 0.50960895 -0.13736911)'],
		['rgb(from color(display-p3 0 0 0) r g b)', 'color(srgb 0 0 0)'],

		['rgb(from color(xyz 0 0.5 1) r g b)', 'color(srgb -1.10944566 0.99095134 0.97994511)'],
		['rgb(from color(xyz 0.25 0 1) r g b)', 'color(srgb 0.59403754 -0.48537786 1.03053617)'],
		['rgb(from color(xyz 0.25 0.5 0) r g b)', 'color(srgb 0.22532444 0.85195951 -0.32837163)'],
		['rgb(from color(xyz 0 0 1) r g b)', 'color(srgb -0.73444124 0.22533613 1.02463965)'],
		['rgb(from color(xyz 0.25 0 0) r g b)', 'color(srgb 0.91144108 -0.5294417 0.12266689)'],
		['rgb(from color(xyz 0 0.5 0) r g b)', 'color(srgb -0.89047311 0.97222877 -0.35251984)'],
		['rgb(from color(xyz 0 0 0) r g b)', 'color(srgb 0 0 0)'],

		['rgb(from color(xyz-d50 0 0.5 1) r g b)', 'color(srgb -1.12162774 0.99628519 1.11843052)'],
		['rgb(from color(xyz-d50 0.25 0 1) r g b)', 'color(srgb 0.57746244 -0.49697943 1.16718092)'],
		['rgb(from color(xyz-d50 0.25 0.5 0) r g b)', 'color(srgb -0.17244425 0.8615337 -0.34323366)'],
		['rgb(from color(xyz-d50 0 0 1) r g b)', 'color(srgb -0.729173 0.20108194 1.16072115)'],
		['rgb(from color(xyz-d50 0.25 0 0) r g b)', 'color(srgb 0.89803728 -0.53183469 0.1427746)'],
		['rgb(from color(xyz-d50 0 0.5 0) r g b)', 'color(srgb -0.91067057 0.98136351 -0.37263152)'],
		['rgb(from color(xyz-d50 0 0 0) r g b)', 'color(srgb 0 0 0)'],

		['rgb(from hwb(0 100% 100%) r g b)', 'color(srgb 0.5 0.5 0.5)'],
		['rgb(from hsl(0 0 0) r g b)', 'color(srgb 0 0 0)'],
		['rgb(from lab(0 0 0) r g b)', 'color(srgb 0 0 0)'],
		['rgb(from oklab(0 0 0) r g b)', 'color(srgb 0 0 0)'],

		// lab
		['lab(from lab(0 10 10) l a b)', 'lab(0 10 10)'],
		['lab(from lab(50 0 10) l a b)', 'lab(50 0 10)'],
		['lab(from lab(50 10 0) l a b)', 'lab(50 10 0)'],
		['lab(from lab(0 0 10) l a b)', 'lab(0 0 10)'],
		['lab(from lab(50 0 0) l a b)', 'lab(50 0 0)'],
		['lab(from lab(0 10 0) l a b)', 'lab(0 10 0)'],
		['lab(from lab(0 0 0) l a b)', 'lab(0 0 0)'],

		['lab(from oklab(0 0.1 0.1) l a b)', 'lab(0.20826503 -1.96485158 6.29937155)'],
		['lab(from oklab(0.5 0 0.1) l a b)', 'lab(42.22128134 4.79509229 47.39513153)'],
		['lab(from oklab(0.5 0.1 0) l a b)', 'lab(40.74235313 32.84691548 0.41354824)'],
		['lab(from oklab(0 0 0.1) l a b)', 'lab(0.17441999 -2.55660361 5.1382874)'],
		['lab(from oklab(0.5 0 0) l a b)', 'lab(42 0 0)'],
		['lab(from oklab(0 0.1 0) l a b)', 'lab(0 0.33122624 0.00695957)'],
		['lab(from oklab(0 0 0) l a b)', 'lab(0 0 0)'],

		['lab(from hwb(0 100% 100%) l a b)', 'lab(53.38896474 0 0)'],
		['lab(from hsl(0 0 0) l a b)', 'lab(0 0 0)'],
		['lab(from rgb(0 0 0) l a b)', 'lab(0 0 0)'],
		['lab(from color(display-p3 0 0 0) l a b)', 'lab(0 0 0)'],
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			reducePrecisionWholeValue(computedValue(test[0])),
			test[1],
			`"${test[0]}" : ${test[1]}`,
		);
	}
}
