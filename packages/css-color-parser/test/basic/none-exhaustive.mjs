import assert from 'node:assert';
import { computedValue, reducePrecisionWholeValue } from '../util/serialize.mjs';

{
	const tests = [
		// https://github.com/w3c/csswg-drafts/issues/14095
		['hsl(from hsl(180 none 50%) h s l)', 'hsl(180 none 50%)'],
		['hsl(from hsl(180 0 50%) h s l)', 'color(srgb 0.5 0.5 0.5)'],
		['hsl(from lch(20 none 180) h s l)', 'hsl(none none 18.93757452%)'],
		['hsl(from lch(20 0 180) h s l)', 'hsl(none 0% 18.93757452%)'],

		// https://github.com/w3c/csswg-drafts/issues/14100
		['lch(from orchid l 0 h)', 'lch(62.75256542 0 326.96909222)'],
		['lch(from lch(from orchid l 0 h) l c h)', 'lch(62.75256542 0 326.96909222)'],
		['color-mix(in lch, lch(from orchid l 0 h))', 'lch(62.75256542 0 326.96909222)'],

		// exhaustive tests
		// HSL
		['hsl(from hsl(none 50% 50%) h s l)', 'hsl(none 50% 50%)'],
		['hsl(from hsl(180 none 50%) h s l)', 'hsl(180 none 50%)'],
		['hsl(from hsl(180 50% none) h s l)', 'hsl(180 50% none)'],
		['hsl(from hsl(none none 50%) h s l)', 'hsl(none none 50%)'],
		['hsl(from hsl(180 none none) h s l)', 'hsl(180 none none)'],
		['hsl(from hsl(none 50% none) h s l)', 'hsl(none 50% none)'],
		['hsl(from hsl(none none none) h s l)', 'hsl(none none none)'],

		['hsl(from hwb(none 25% 25%) h s l)', 'hsl(none 50% 50%)'],
		['hsl(from hwb(180 none 25%) h s l)', 'color(srgb 0 0.75 0.75)'],
		['hsl(from hwb(180 25% none) h s l)', 'color(srgb 0.25 1 1)'],
		['hsl(from hwb(none none 25%) h s l)', 'hsl(none 100% 37.5%)'],
		['hsl(from hwb(180 none none) h s l)', 'hsl(180 none none)'],
		['hsl(from hwb(none 25% none) h s l)', 'hsl(none 100% 62.5%)'],
		['hsl(from hwb(none none none) h s l)', 'hsl(none none none)'],

		['hsl(from lch(none 20 180) h s l)', 'hsl(339.80326134 266.58541811% none)'],
		['hsl(from lch(20 none 180) h s l)', 'hsl(none none 18.93757452%)'],
		['hsl(from lch(20 20 none) h s l)', 'hsl(none 35.05613281% 21.64776943%)'],
		['hsl(from lch(none none 180) h s l)', 'hsl(none none none)'],
		['hsl(from lch(20 none none) h s l)', 'hsl(none none 18.93757452%)'],
		['hsl(from lch(none 20 none) h s l)', 'hsl(none 266.58541811% none)'],
		['hsl(from lch(none none none) h s l)', 'hsl(none none none)'],

		['hsl(from oklch(none 0.2 180) h s l)', 'hsl(345.65323987 193.08743918% none)'],
		['hsl(from oklch(0.2 none 180) h s l)', 'hsl(none none 8.61042044%)'],
		['hsl(from oklch(0.2 0.2 none) h s l)', 'hsl(none 250.47260791% 8.44443686%)'],
		['hsl(from oklch(none none 180) h s l)', 'hsl(none none none)'],
		['hsl(from oklch(0.2 none none) h s l)', 'hsl(none none 8.61042044%)'],
		['hsl(from oklch(none 0.2 none) h s l)', 'hsl(none 193.08743918% none)'],
		['hsl(from oklch(none none none) h s l)', 'hsl(none none none)'],

		['hsl(from lab(none 10 10) h s l)', 'hsl(15.41935071 846.24593338% none)'],
		['hsl(from lab(50 none 10) h s l)', 'color(srgb 0.48695869 0.46487838 0.39973421)'],
		['hsl(from lab(50 10 none) h s l)', 'color(srgb 0.53211144 0.44322485 0.46796893)'],
		['hsl(from lab(none none 10) h s l)', 'hsl(221.36868606 238.90028442% none)'],
		['hsl(from lab(50 none none) h s l)', 'hsl(none none 46.63266093%)'],
		['hsl(from lab(none 10 none) h s l)', 'hsl(342.55812287 218.14148709% none)'],
		['hsl(from lab(none none none) h s l)', 'hsl(none none none)'],

		['hsl(from oklab(none 0.1 0.1) h s l)', 'hsl(243.07265774 131.85826046% none)'],
		['hsl(from oklab(0.5 none 0.1) h s l)', 'color(srgb 0.4759136 0.37572819 0.02451529)'],
		['hsl(from oklab(0.5 0.1 none) h s l)', 'color(srgb 0.56587447 0.28546849 0.37966669)'],
		['hsl(from oklab(none none 0.1) h s l)', 'hsl(256.18317397 149.40414617% none)'],
		['hsl(from oklab(0.5 none none) h s l)', 'hsl(none none 38.8572859%)'],
		['hsl(from oklab(none 0.1 none) h s l)', 'hsl(345.65323987 193.08743918% none)'],
		['hsl(from oklab(none none none) h s l)', 'hsl(none none none)'],

		['hsl(from rgb(none none none) h s l)', 'hsl(none none none)'],
		['hsl(from color(display-p3 none none none) h s l)', 'hsl(none none none)'],

		// HWB
		['hwb(from hsl(none 50% 50%) h w b)', 'hwb(none 25% 25%)'],
		['hwb(from hsl(180 none 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 50% none) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(none none 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 none none) h w b)', 'hwb(none none none)'],
		['hwb(from hsl(none 50% none) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(none none none) h w b)', 'hwb(none none none)'],

		['hwb(from hwb(none 25% 25%) h w b)', 'hwb(none 25% 25%)'],
		['hwb(from hwb(180 none 25%) h w b)', 'hwb(180 none 25%)'],
		['hwb(from hwb(180 25% none) h w b)', 'hwb(180 25% none)'],
		['hwb(from hwb(none none 25%) h w b)', 'hwb(none none 25%)'],
		['hwb(from hwb(180 none none) h w b)', 'hwb(180 none none)'],
		['hwb(from hwb(none 25% none) h w b)', 'hwb(none 25% none)'],
		['hwb(from hwb(none none none) h w b)', 'hwb(none none none)'],

		['hwb(from lch(none 20 180) h w b)', 'color(srgb -0.13099833 0.05952886 -0.00460494)'],
		['hwb(from lch(20 none 180) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(20 20 none) h w b)', 'hwb(none 14.05889863% 70.76335977%)'],
		['hwb(from lch(none none 180) h w b)', 'hwb(none none none)'],
		['hwb(from lch(20 none none) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(none 20 none) h w b)', 'hwb(none -5.95288574% 86.90016729%)'],
		['hwb(from lch(none none none) h w b)', 'hwb(none none none)'],

		['hwb(from oklch(none 0.2 180) h w b)', 'color(srgb -0.0266189 0.00845442 0.00006795)'],
		['hwb(from oklch(0.2 none 180) h w b)', 'hwb(none 8.61042044% 91.38957956%)'],
		['hwb(from oklch(0.2 0.2 none) h w b)', 'hwb(none -12.70656437% 70.40456191%)'],
		['hwb(from oklch(none none 180) h w b)', 'hwb(none none none)'],
		['hwb(from oklch(0.2 none none) h w b)', 'hwb(none 8.61042044% 91.38957956%)'],
		['hwb(from oklch(none 0.2 none) h w b)', 'hwb(none -0.84544246% 97.33810956%)'],
		['hwb(from oklch(none none none) h w b)', 'hwb(none none none)'],

		['hwb(from lab(none 10 10) h w b)', 'color(srgb 0.10216252 -0.03360919 -0.08056929)'],
		['hwb(from lab(50 none 10) h w b)', 'color(srgb 0.48695869 0.46487838 0.39973421)'],
		['hwb(from lab(50 10 none) h w b)', 'color(srgb 0.53211144 0.44322485 0.46796893)'],
		['hwb(from lab(none none 10) h w b)', 'color(srgb 0.03358551 -0.00228914 -0.08194467)'],
		['hwb(from lab(50 none none) h w b)', 'hwb(none 46.63266093% 53.36733907%)'],
		['hwb(from lab(none 10 none) h w b)', 'color(srgb 0.0843413 -0.03132005 0.00230247)'],
		['hwb(from lab(none none none) h w b)', 'hwb(none none none)'],

		['hwb(from oklab(none 0.1 0.1) h w b)', 'color(srgb 0.00443054 0.00769076 -0.05597186)'],
		['hwb(from oklab(0.5 none 0.1) h w b)', 'color(srgb 0.4759136 0.37572819 0.02451529)'],
		['hwb(from oklab(0.5 0.1 none) h w b)', 'color(srgb 0.56587447 0.28546849 0.37966669)'],
		['hwb(from oklab(none none 0.1) h w b)', 'color(srgb -0.00588767 0.00932583 -0.04707904)'],
		['hwb(from oklab(0.5 none none) h w b)', 'hwb(none 38.8572859% 61.1427141%)'],
		['hwb(from oklab(none 0.1 none) h w b)', 'color(srgb 0.00332736 -0.0010568 -0.00000849)'],
		['hwb(from oklab(none none none) h w b)', 'hwb(none none none)'],

		['hwb(from rgb(none none none) h w b)', 'hwb(none none none)'],
		['hwb(from color(display-p3 none none none) h w b)', 'hwb(none none none)'],

		// LCH
		['lch(from hsl(none 50% 50%) l c h)', 'lch(46.42043661 59.74639249 none)'],
		['lch(from hsl(180 none 50%) l c h)', 'lch(53.38896474 none none)'],
		['lch(from hsl(180 50% none) l c h)', 'lch(none 0 none)'],
		['lch(from hsl(none none 50%) l c h)', 'lch(53.38896474 none none)'],
		['lch(from hsl(180 none none) l c h)', 'lch(none none none)'],
		['lch(from hsl(none 50% none) l c h)', 'lch(none 0 none)'],
		['lch(from hsl(none none none) l c h)', 'lch(none none none)'],

		['lch(from hwb(none 25% 25%) l c h)', 'lch(46.42043661 59.74639249 none)'],
		['lch(from hwb(180 none 25%) l c h)', 'lch(69.91337803 42.54334477 196.45478916)'],
		['lch(from hwb(180 25% none) l c h)', 'lch(91.18116399 49.29673753 196.65803824)'],
		['lch(from hwb(none none 25%) l c h)', 'lch(40.61501478 86.05118759 none)'],
		['lch(from hwb(180 none none) l c h)', 'lch(none none 196.45478916)'],
		['lch(from hwb(none 25% none) l c h)', 'lch(58.23109529 85.49243054 none)'],
		['lch(from hwb(none none none) l c h)', 'lch(none none none)'],

		['lch(from lch(none 20 180) l c h)', 'lch(none 20 180)'],
		['lch(from lch(20 none 180) l c h)', 'lch(20 none 180)'],
		['lch(from lch(20 20 none) l c h)', 'lch(20 20 none)'],
		['lch(from lch(none none 180) l c h)', 'lch(none none 180)'],
		['lch(from lch(20 none none) l c h)', 'lch(20 none none)'],
		['lch(from lch(none 20 none) l c h)', 'lch(none 20 none)'],
		['lch(from lch(none none none) l c h)', 'lch(none none none)'],

		['lch(from oklch(none 0.2 180) l c h)', 'lch(none 2.6503948 181.20369565)'],
		['lch(from oklch(0.2 none 180) l c h)', 'lch(7.22637037 none none)'],
		['lch(from oklch(0.2 0.2 none) l c h)', 'lch(5.10873217 59.48824051 none)'],
		['lch(from oklch(none none 180) l c h)', 'lch(none none none)'],
		['lch(from oklch(0.2 none none) l c h)', 'lch(7.22637037 none none)'],
		['lch(from oklch(none 0.2 none) l c h)', 'lch(none 2.6503948 none)'],
		['lch(from oklch(none none none) l c h)', 'lch(none none none)'],

		['lch(from lab(none 10 10) l c h)', 'lch(none 14.14213562 45)'],
		['lch(from lab(50 none 10) l c h)', 'lch(50 10 90)'],
		['lch(from lab(50 10 none) l c h)', 'lch(50 10 0)'],
		['lch(from lab(none none 10) l c h)', 'lch(none 10 90)'],
		['lch(from lab(50 none none) l c h)', 'lch(50 none none)'],
		['lch(from lab(none 10 none) l c h)', 'lch(none 10 0)'],
		['lch(from lab(none none none) l c h)', 'lch(none none none)'],

		['lch(from oklab(none 0.1 0.1) l c h)', 'lch(none 6.59869105 107.32334354)'],
		['lch(from oklab(0.5 none 0.1) l c h)', 'lch(42.22128134 47.63708012 84.22289046)'],
		['lch(from oklab(0.5 0.1 none) l c h)', 'lch(40.74235313 32.8495187 0.72132548)'],
		['lch(from oklab(none none 0.1) l c h)', 'lch(none 5.73918282 116.45307687)'],
		['lch(from oklab(0.5 none none) l c h)', 'lch(42 none none)'],
		['lch(from oklab(none 0.1 none) l c h)', 'lch(none 0.33129935 1.20369565)'],
		['lch(from oklab(none none none) l c h)', 'lch(none none none)'],

		['lch(from rgb(none none none) l c h)', 'lch(none none none)'],
		['lch(from color(display-p3 none none none) l c h)', 'lch(none none none)'],

		// oklch
		['oklch(from hsl(none 50% 50%) l c h)', 'oklch(0.55233858 0.16366995 none)'],
		['oklch(from hsl(180 none 50%) l c h)', 'oklch(0.59818073 none none)'],
		['oklch(from hsl(180 50% none) l c h)', 'oklch(none 0 none)'],
		['oklch(from hsl(none none 50%) l c h)', 'oklch(0.59818073 none none)'],
		['oklch(from hsl(180 none none) l c h)', 'oklch(none none none)'],
		['oklch(from hsl(none 50% none) l c h)', 'oklch(none 0 none)'],
		['oklch(from hsl(none none none) l c h)', 'oklch(none none none)'],

		['oklch(from hwb(none 25% 25%) l c h)', 'oklch(0.55233858 0.16366995 none)'],
		['oklch(from hwb(180 none 25%) l c h)', 'oklch(0.72924735 0.12448121 194.7689599)'],
		['oklch(from hwb(180 25% none) l c h)', 'oklch(0.91079253 0.14429702 194.91785641)'],
		['oklch(from hwb(none none 25%) l c h)', 'oklch(0.50578216 0.20754918 none)'],
		['oklch(from hwb(180 none none) l c h)', 'oklch(none none 194.7689599)'],
		['oklch(from hwb(none 25% none) l c h)', 'oklch(0.65951623 0.22690049 none)'],
		['oklch(from hwb(none none none) l c h)', 'oklch(none none none)'],

		['oklch(from lch(none 20 180) l c h)', 'oklch(none 0.26412556 175.27132911)'],
		['oklch(from lch(20 none 180) l c h)', 'oklch(0.31034483 none none)'],
		['oklch(from lch(20 20 none) l c h)', 'oklch(0.31697196 0.06085528 none)'],
		['oklch(from lch(none none 180) l c h)', 'oklch(none none none)'],
		['oklch(from lch(20 none none) l c h)', 'oklch(0.31034483 none none)'],
		['oklch(from lch(none 20 none) l c h)', 'oklch(none 0.26412556 none)'],
		['oklch(from lch(none none none) l c h)', 'oklch(none none none)'],

		['oklch(from oklch(none 0.2 180) l c h)', 'oklch(none 0.2 180)'],
		['oklch(from oklch(0.2 none 180) l c h)', 'oklch(0.2 none 180)'],
		['oklch(from oklch(0.2 0.2 none) l c h)', 'oklch(0.2 0.2 none)'],
		['oklch(from oklch(none none 180) l c h)', 'oklch(none none 180)'],
		['oklch(from oklch(0.2 none none) l c h)', 'oklch(0.2 none none)'],
		['oklch(from oklch(none 0.2 none) l c h)', 'oklch(none 0.2 none)'],
		['oklch(from oklch(none none none) l c h)', 'oklch(none none none)'],

		['oklch(from lab(none 10 10) l c h)', 'oklch(none 0.3755088 12.38482735)'],
		['oklch(from lab(50 none 10) l c h)', 'oklch(0.56788978 0.02565454 91.47921894)'],
		['oklch(from lab(50 10 none) l c h)', 'oklch(0.57220592 0.02980361 359.47844895)'],
		['oklch(from lab(none none 10) l c h)', 'oklch(none 0.27769178 16.66376148)'],
		['oklch(from lab(50 none none) l c h)', 'oklch(0.56896552 none none)'],
		['oklch(from lab(none 10 none) l c h)', 'oklch(none 0.2096366 355.27132911)'],
		['oklch(from lab(none none none) l c h)', 'oklch(none none none)'],

		['oklch(from oklab(none 0.1 0.1) l c h)', 'oklch(none 0.14142136 45)'],
		['oklch(from oklab(0.5 none 0.1) l c h)', 'oklch(0.5 0.1 90)'],
		['oklch(from oklab(0.5 0.1 none) l c h)', 'oklch(0.5 0.1 0)'],
		['oklch(from oklab(none none 0.1) l c h)', 'oklch(none 0.1 90)'],
		['oklch(from oklab(0.5 none none) l c h)', 'oklch(0.5 none none)'],
		['oklch(from oklab(none 0.1 none) l c h)', 'oklch(none 0.1 0)'],
		['oklch(from oklab(none none none) l c h)', 'oklch(none none none)'],

		['oklch(from rgb(none none none) l c h)', 'oklch(none none none)'],
		['oklch(from color(display-p3 none none none) l c h)', 'oklch(none none none)'],

		// rgb
		['rgb(from rgb(none 50 100) r g b)', 'color(srgb none 0.19607843 0.39215686)'],
		['rgb(from rgb(25 none 100) r g b)', 'color(srgb 0.09803922 none 0.39215686)'],
		['rgb(from rgb(25 50 none) r g b)', 'color(srgb 0.09803922 0.19607843 none)'],
		['rgb(from rgb(none none 100) r g b)', 'color(srgb none none 0.39215686)'],
		['rgb(from rgb(25 none none) r g b)', 'color(srgb 0.09803922 none none)'],
		['rgb(from rgb(none 50 none) r g b)', 'color(srgb none 0.19607843 none)'],
		['rgb(from rgb(none none none) r g b)', 'color(srgb none none none)'],

		['rgb(from color(display-p3 none 0.5 1) r g b)', 'color(srgb none 0.50960895 1.03498498)'],
		['rgb(from color(display-p3 0.25 none 1) r g b)', 'color(srgb 0.27690544 none 1.0416057)'],
		['rgb(from color(display-p3 0.25 0.5 none) r g b)', 'color(srgb 0.12407597 0.50734577 none)'],
		['rgb(from color(display-p3 none none 1) r g b)', 'color(srgb none none 1.04202162)'],
		['rgb(from color(display-p3 0.25 none none) r g b)', 'color(srgb 0.27690544 none none)'],
		['rgb(from color(display-p3 none 0.5 none) r g b)', 'color(srgb none 0.50960895 none)'],
		['rgb(from color(display-p3 none none none) r g b)', 'color(srgb none none none)'],

		['rgb(from color(xyz none 0.5 1) r g b)', 'color(srgb none 0.99095134 0.97994511)'],
		['rgb(from color(xyz 0.25 none 1) r g b)', 'color(srgb 0.59403754 none 1.03053617)'],
		['rgb(from color(xyz 0.25 0.5 none) r g b)', 'color(srgb 0.22532444 0.85195951 none)'],
		['rgb(from color(xyz none none 1) r g b)', 'color(srgb none none 1.02463965)'],
		['rgb(from color(xyz 0.25 none none) r g b)', 'color(srgb 0.91144108 none none)'],
		['rgb(from color(xyz none 0.5 none) r g b)', 'color(srgb none 0.97222877 none)'],
		['rgb(from color(xyz none none none) r g b)', 'color(srgb none none none)'],

		['rgb(from color(xyz-d50 none 0.5 1) r g b)', 'color(srgb none 0.99628519 1.11843052)'],
		['rgb(from color(xyz-d50 0.25 none 1) r g b)', 'color(srgb 0.57746244 none 1.16718092)'],
		['rgb(from color(xyz-d50 0.25 0.5 none) r g b)', 'color(srgb -0.17244425 0.8615337 none)'],
		['rgb(from color(xyz-d50 none none 1) r g b)', 'color(srgb none none 1.16072115)'],
		['rgb(from color(xyz-d50 0.25 none none) r g b)', 'color(srgb 0.89803728 none none)'],
		['rgb(from color(xyz-d50 none 0.5 none) r g b)', 'color(srgb none 0.98136351 none)'],
		['rgb(from color(xyz-d50 none none none) r g b)', 'color(srgb none none none)'],

		['rgb(from hwb(none none none) r g b)', 'color(srgb none none none)'],
		['rgb(from hsl(none none none) r g b)', 'color(srgb none none none)'],
		['rgb(from lab(none none none) r g b)', 'color(srgb none none none)'],
		['rgb(from oklab(none none none) r g b)', 'color(srgb none none none)'],

		// lab
		['lab(from lab(none 10 10) l a b)', 'lab(none 10 10)'],
		['lab(from lab(50 none 10) l a b)', 'lab(50 none 10)'],
		['lab(from lab(50 10 none) l a b)', 'lab(50 10 none)'],
		['lab(from lab(none none 10) l a b)', 'lab(none none 10)'],
		['lab(from lab(50 none none) l a b)', 'lab(50 none none)'],
		['lab(from lab(none 10 none) l a b)', 'lab(none 10 none)'],
		['lab(from lab(none none none) l a b)', 'lab(none none none)'],

		['lab(from oklab(none 0.1 0.1) l a b)', 'lab(none -1.96485158 6.29937155)'],
		['lab(from oklab(0.5 none 0.1) l a b)', 'lab(42.22128134 none 47.39513153)'],
		['lab(from oklab(0.5 0.1 none) l a b)', 'lab(40.74235313 32.84691548 none)'],
		['lab(from oklab(none none 0.1) l a b)', 'lab(none none 5.1382874)'],
		['lab(from oklab(0.5 none none) l a b)', 'lab(42 none none)'],
		['lab(from oklab(none 0.1 none) l a b)', 'lab(none 0.33122624 none)'],
		['lab(from oklab(none none none) l a b)', 'lab(none none none)'],

		['lab(from hwb(none none none) l a b)', 'lab(none none none)'],
		['lab(from hsl(none none none) l a b)', 'lab(none none none)'],
		['lab(from rgb(none none none) l a b)', 'lab(none none none)'],
		['lab(from color(display-p3 none none none) l a b)', 'lab(none none none)'],
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			reducePrecisionWholeValue(computedValue(test[0])),
			test[1],
			`"${test[0]}" : ${test[1]}`,
		);
	}
}
