import assert from 'node:assert';
import { computedValue, reducePrecisionWholeValue } from '../util/serialize.mjs';

{
	const tests = [
		// exhaustive tests
		// HSL
		['hsl(from hsl(0 50% 50%) h s l)', 'color(srgb 0.75 0.25 0.25)'],
		['hsl(from hsl(180 0 50%) h s l)', 'color(srgb 0.5 0.5 0.5)'],
		['hsl(from hsl(180 50% 0) h s l)', 'color(srgb 0 0 0)'],
		['hsl(from hsl(0 0 50%) h s l)', 'color(srgb 0.5 0.5 0.5)'],
		['hsl(from hsl(180 0 0) h s l)', 'color(srgb 0 0 0)'],
		['hsl(from hsl(0 50% 0) h s l)', 'color(srgb 0 0 0)'],
		['hsl(from hsl(0 0 0) h s l)', 'color(srgb 0 0 0)'],

		['hsl(from hsl(180 0.001% 50%) h s l)', 'color(srgb 0.500005 0.499995 0.499995)'],
		['hsl(from hsl(180 0.0011% 50%) h s l)', 'color(srgb 0.4999945 0.5000055 0.5000055)'],

		['hsl(from hwb(0 25% 25%) h s l)', 'color(srgb 0.75 0.25 0.25)'],
		['hsl(from hwb(180 100% 25%) h s l)', 'hsl(none 0% 80%)'],
		['hsl(from hwb(180 25% 100%) h s l)', 'hsl(none 0% 20%)'],
		['hsl(from hwb(0 100% 25%) h s l)', 'hsl(none 0% 80%)'],
		['hsl(from hwb(180 100% 100%) h s l)', 'hsl(none 0% 50%)'],
		['hsl(from hwb(0 25% 100%) h s l)', 'hsl(none 0% 20%)'],
		['hsl(from hwb(0 100% 100%) h s l)', 'hsl(none 0% 50%)'],

		['hsl(from hwb(180 99.999% 0%) h s l)', 'hsl(none 100% 99.9995%)'],
		['hsl(from hwb(180 99.998% 0%) h s l)', 'color(srgb 0.99998 1 1)'],

		['hsl(from lch(0 20 180) h s l)', 'color(srgb -0.13099833 0.05952886 -0.00460494)'],
		['hsl(from lch(20 0 180) h s l)', 'hsl(none 0% 18.93757452%)'],
		['hsl(from lch(20 20 0) h s l)', 'color(srgb 0.2923664 0.14058899 0.19244775)'],
		['hsl(from lch(0 0 180) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from lch(20 0 0) h s l)', 'hsl(none 0% 18.93757452%)'],
		['hsl(from lch(0 20 0) h s l)', 'color(srgb 0.13099833 -0.05952886 0.00460494)'],
		['hsl(from lch(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from lch(20 0.0015 180) h s l)', 'hsl(none 0.00309202% 18.93788137%)'],
		['hsl(from lch(20 0.00151 180) h s l)', 'color(srgb 0.18936676 0.18937855 0.18937554)'],

		['hsl(from oklch(0 0.2 180) h s l)', 'color(srgb -0.0266189 0.00845442 0.00006795)'],
		['hsl(from oklch(0.2 0 180) h s l)', 'hsl(none 0% 8.61042044%)'],
		['hsl(from oklch(0.2 0.2 0) h s l)', 'color(srgb 0.29595438 -0.12706564 0.07183401)'],
		['hsl(from oklch(0 0 180) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from oklch(0.2 0 0) h s l)', 'hsl(none 0% 8.61042044%)'],
		['hsl(from oklch(0 0.2 0) h s l)', 'color(srgb 0.0266189 -0.00845442 -0.00006795)'],
		['hsl(from oklch(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from oklch(0.2 0.000004 180) h s l)', 'hsl(none 0.00551409% 8.61063148%)'],
		['hsl(from oklch(0.2 0.0000041 180) h s l)', 'color(srgb 0.08609717 0.08610691 0.08610449)'],

		['hsl(from rgb(0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from color(display-p3 0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from lab(0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from oklab(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from color(display-p3 0.50000322 0.49999533 0.49999517) h s l)', 'hsl(none 0.00099966% 49.99999965%)'],
		['hsl(from color(display-p3 0.49999645 0.50000513 0.50000531) h s l)', 'color(srgb 0.4999945 0.5000055 0.5000055)'],

		// HWB
		['hwb(from hsl(0 50% 50%) h w b)', 'color(srgb 0.75 0.25 0.25)'],
		['hwb(from hsl(180 0 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 50% 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 0 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 50% 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from hsl(180 0.001% 50%) h w b)', 'hwb(none 49.9995% 49.9995%)'],
		['hwb(from hsl(180 0.0011% 50%) h w b)', 'color(srgb 0.4999945 0.5000055 0.5000055)'],

		['hwb(from hwb(0 25% 25%) h w b)', 'color(srgb 0.75 0.25 0.25)'],
		['hwb(from hwb(180 100% 25%) h w b)', 'color(srgb 0.8 0.8 0.8)'],
		['hwb(from hwb(180 25% 100%) h w b)', 'color(srgb 0.2 0.2 0.2)'],
		['hwb(from hwb(0 100% 25%) h w b)', 'color(srgb 0.8 0.8 0.8)'],
		['hwb(from hwb(180 100% 100%) h w b)', 'color(srgb 0.5 0.5 0.5)'],
		['hwb(from hwb(0 25% 100%) h w b)', 'color(srgb 0.2 0.2 0.2)'],
		['hwb(from hwb(0 100% 100%) h w b)', 'color(srgb 0.5 0.5 0.5)'],

		['hwb(from hwb(180 99.999% 0%) h w b)', 'color(srgb 1 0.99999 0.99999)'],
		['hwb(from hwb(180 99.998% 0%) h w b)', 'color(srgb 0.99998 1 1)'],

		['hwb(from lch(0 20 180) h w b)', 'color(srgb -0.13099833 0.05952886 -0.00460494)'],
		['hwb(from lch(20 0 180) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(20 20 0) h w b)', 'color(srgb 0.2923664 0.14058899 0.19244775)'],
		['hwb(from lch(0 0 180) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from lch(20 0 0) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(0 20 0) h w b)', 'color(srgb 0.13099833 -0.05952886 0.00460494)'],
		['hwb(from lch(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from lch(20 0.0015 180) h w b)', 'hwb(none 18.93729581% 81.06153307%)'],
		['hwb(from lch(20 0.00151 180) h w b)', 'color(srgb 0.18936676 0.18937855 0.18937554)'],

		['hwb(from oklch(0 0.2 180) h w b)', 'color(srgb -0.0266189 0.00845442 0.00006795)'],
		['hwb(from oklch(0.2 0 180) h w b)', 'hwb(none 8.61042044% 91.38957956%)'],
		['hwb(from oklch(0.2 0.2 0) h w b)', 'color(srgb 0.29595438 -0.12706564 0.07183401)'],
		['hwb(from oklch(0 0 180) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from oklch(0.2 0 0) h w b)', 'hwb(none 8.61042044% 91.38957956%)'],
		['hwb(from oklch(0 0.2 0) h w b)', 'color(srgb 0.0266189 -0.00845442 -0.00006795)'],
		['hwb(from oklch(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from oklch(0.8 0.000004 180) h w b)', 'hwb(none 74.3202188% 25.67843825%)'],
		['hwb(from oklch(0.8 0.0000041 180) h w b)', 'color(srgb 0.74319598 0.74320974 0.74320633)'],

		['hwb(from rgb(0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from color(display-p3 0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from lab(0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from oklab(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from color(display-p3 0.50000322 0.49999533 0.49999517) h w b)', 'hwb(none 49.99949982% 49.99950052%)'],
		['hwb(from color(display-p3 0.49999645 0.50000513 0.50000531) h w b)', 'color(srgb 0.4999945 0.5000055 0.5000055)'],

		// LCH
		['lch(from hsl(0 50% 50%) l c h)', 'lch(46.42043661 59.74639249 29.95665674)'],
		['lch(from hsl(180 0 50%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hsl(180 50% 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 0 50%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hsl(180 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 50% 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 0 0) l c h)', 'lch(0 0 none)'],

		['lch(from hsl(180 0.001% 50%) l c h)', 'lch(53.38868718 0.00105193 none)'],
		['lch(from hsl(180 0.0011% 50%) l c h)', 'lch(53.38927006 0.00115711 none)'],

		['lch(from hwb(0 25% 25%) l c h)', 'lch(46.42043661 59.74639249 29.95665674)'],
		['lch(from hwb(180 100% 25%) l c h)', 'lch(82.04578167 0 none)'],
		['lch(from hwb(180 25% 100%) l c h)', 'lch(21.24673129 0 none)'],
		['lch(from hwb(0 100% 25%) l c h)', 'lch(82.04578167 0 none)'],
		['lch(from hwb(180 100% 100%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hwb(0 25% 100%) l c h)', 'lch(21.24673129 0 none)'],
		['lch(from hwb(0 100% 100%) l c h)', 'lch(53.38896474 0 none)'],

		['lch(from hwb(180 99.999% 0%) l c h)', 'lch(99.99931609 0.00092512 none)'],
		['lch(from hwb(180 99.998% 0%) l c h)', 'lch(99.99960858 0.00185022 199.69899791)'],

		['lch(from lch(0 20 180) l c h)', 'lch(0 20 180)'],
		['lch(from lch(20 0 180) l c h)', 'lch(20 0 180)'],
		['lch(from lch(20 20 0) l c h)', 'lch(20 20 0)'],
		['lch(from lch(0 0 180) l c h)', 'lch(0 0 180)'],
		['lch(from lch(20 0 0) l c h)', 'lch(20 0 0)'],
		['lch(from lch(0 20 0) l c h)', 'lch(0 20 0)'],
		['lch(from lch(0 0 0) l c h)', 'lch(0 0 0)'],

		['lch(from lch(20 0.0015 180) l c h)', 'lch(20 0.0015 180)'],
		['lch(from lch(20 0.00151 180) l c h)', 'lch(20 0.00151 180)'],

		['lch(from oklch(0 0.2 180) l c h)', 'lch(0.00996014 2.6503948 181.20369565)'],
		['lch(from oklch(0.2 0 180) l c h)', 'lch(7.22637037 0 none)'],
		['lch(from oklch(0.2 0.2 0) l c h)', 'lch(5.10873217 59.48824051 1.24207317)'],
		['lch(from oklch(0 0 180) l c h)', 'lch(0 0 none)'],
		['lch(from oklch(0.2 0 0) l c h)', 'lch(7.22637037 0 none)'],
		['lch(from oklch(0 0.2 0) l c h)', 'lch(0 2.6503948 1.20369565)'],
		['lch(from oklch(0 0 0) l c h)', 'lch(0 0 none)'],

		['lch(from oklch(0.2 0.000004 180) l c h)', 'lch(7.22632342 0.00126523 none)'],
		['lch(from oklch(0.2 0.0000041 180) l c h)', 'lch(7.22641849 0.00129685 none)'],

		['lch(from rgb(0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from color(display-p3 0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from lab(0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from oklab(0 0 0) l c h)', 'lch(0 0 none)'],

		['lch(from color(display-p3 0.1893689 0.18937814 0.18937561) l c h)', 'lch(19.99999973 0.00149922 none)'],
		['lch(from color(display-p3 0.18936885 0.18937816 0.18937561) l c h)', 'lch(19.99999994 0.00151062 180.02568063)'],

		// oklch
		['oklch(from hsl(0 50% 50%) l c h)', 'oklch(0.55233858 0.16366995 24.21253898)'],
		['oklch(from hsl(180 0 50%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hsl(180 50% 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 0 50%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hsl(180 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 50% 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 0 0) l c h)', 'oklch(0 0 none)'],

		['oklch(from hsl(180 0.001% 50%) l c h)', 'oklch(0.59817861 0.00000307 none)'],
		['oklch(from hsl(180 0.0011% 50%) l c h)', 'oklch(0.59818306 0.00000338 none)'],

		['oklch(from hwb(0 25% 25%) l c h)', 'oklch(0.55233858 0.16366995 24.21253898)'],
		['oklch(from hwb(180 100% 25%) l c h)', 'oklch(0.84522226 0 none)'],
		['oklch(from hwb(180 25% 100%) l c h)', 'oklch(0.32109251 0 none)'],
		['oklch(from hwb(0 100% 25%) l c h)', 'oklch(0.84522226 0 none)'],
		['oklch(from hwb(180 100% 100%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hwb(0 25% 100%) l c h)', 'oklch(0.32109251 0 none)'],
		['oklch(from hwb(0 100% 100%) l c h)', 'oklch(0.59818073 0 none)'],

		['oklch(from hwb(180 99.999% 0%) l c h)', 'oklch(0.99999435 0.0000027 none)'],
		['oklch(from hwb(180 99.998% 0%) l c h)', 'oklch(0.99999614 0.00000541 197.15830446)'],

		['oklch(from lch(0 20 180) l c h)', 'oklch(0 0.26412556 175.27132911)'],
		['oklch(from lch(20 0 180) l c h)', 'oklch(0.31034483 0 none)'],
		['oklch(from lch(20 20 0) l c h)', 'oklch(0.31697196 0.06085528 359.39300302)'],
		['oklch(from lch(0 0 180) l c h)', 'oklch(0 0 none)'],
		['oklch(from lch(20 0 0) l c h)', 'oklch(0.31034483 0 none)'],
		['oklch(from lch(0 20 0) l c h)', 'oklch(0.05666101 0.26412556 355.27132911)'],
		['oklch(from lch(0 0 0) l c h)', 'oklch(0 0 none)'],

		['oklch(from lch(20 0.0015 180) l c h)', 'oklch(0.31034531 0.00000443 none)'],
		['oklch(from lch(20 0.00151 180) l c h)', 'oklch(0.31034434 0.00000446 179.50900432)'],

		['oklch(from oklch(0 0.2 180) l c h)', 'oklch(0 0.2 180)'],
		['oklch(from oklch(0.2 0 180) l c h)', 'oklch(0.2 0 180)'],
		['oklch(from oklch(0.2 0.2 0) l c h)', 'oklch(0.2 0.2 0)'],
		['oklch(from oklch(0 0 180) l c h)', 'oklch(0 0 180)'],
		['oklch(from oklch(0.2 0 0) l c h)', 'oklch(0.2 0 0)'],
		['oklch(from oklch(0 0.2 0) l c h)', 'oklch(0 0.2 0)'],
		['oklch(from oklch(0 0 0) l c h)', 'oklch(0 0 0)'],

		['oklch(from oklch(0.2 0.000004 180) l c h)', 'oklch(0.2 0.000004 180)'],
		['oklch(from oklch(0.2 0.0000041 180) l c h)', 'oklch(0.2 0.0000041 180)'],

		['oklch(from rgb(0 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from color(display-p3 0 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from lab(0 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from oklab(0 0 0) l c h)', 'oklch(0 0 none)'],

		['oklch(from color(display-p3 0.08610937692934956 0.08610188202042188 0.08610387292082256) l c h)', 'oklch(0.2 0.000004 none)'],
		['oklch(from color(display-p3 0.0860989 0.08610658 0.08610454) l c h)', 'oklch(0.2 0.0000041 179.99967542)'],
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			reducePrecisionWholeValue(computedValue(test[0])),
			test[1],
			`"${test[0]}" : ${test[1]}`,
		);
	}
}
