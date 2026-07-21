import assert from 'node:assert';
import { computedValue, reducePrecisionWholeValue } from '../util/serialize.mjs';

{
	const tests = [
		// exhaustive tests
		// HSL - RCS
		['hsl(from hsl(0 50% 50%) h s l)', 'color(srgb 0.75 0.25 0.25)'],
		['hsl(from hsl(180 0 50%) h s l)', 'color(srgb 0.5 0.5 0.5)'],
		['hsl(from hsl(180 50% 0) h s l)', 'color(srgb 0 0 0)'],
		['hsl(from hsl(0 0 50%) h s l)', 'color(srgb 0.5 0.5 0.5)'],
		['hsl(from hsl(180 0 0) h s l)', 'color(srgb 0 0 0)'],
		['hsl(from hsl(0 50% 0) h s l)', 'color(srgb 0 0 0)'],
		['hsl(from hsl(0 0 0) h s l)', 'color(srgb 0 0 0)'],

		['hsl(from hsl(180 0.001% 50%) h s l)', 'color(srgb 0.5 0.5 0.5)'],
		['hsl(from hsl(180 0.0011% 50%) h s l)', 'color(srgb 0.4999945 0.5000055 0.5000055)'],

		['hsl(from hwb(0 25% 25%) h s l)', 'color(srgb 0.75 0.25 0.25)'],
		['hsl(from hwb(180 100% 25%) h s l)', 'hsl(none 0% 80%)'],
		['hsl(from hwb(180 25% 100%) h s l)', 'hsl(none 0% 20%)'],
		['hsl(from hwb(0 100% 25%) h s l)', 'hsl(none 0% 80%)'],
		['hsl(from hwb(180 100% 100%) h s l)', 'hsl(none 0% 50%)'],
		['hsl(from hwb(0 25% 100%) h s l)', 'hsl(none 0% 20%)'],
		['hsl(from hwb(0 100% 100%) h s l)', 'hsl(none 0% 50%)'],

		['hsl(from hwb(180 49.999% 50%) h s l)', 'hsl(none 0% 49.999%)'],
		['hsl(from hwb(180 49.998% 50%) h s l)', 'color(srgb 0.49998 0.5 0.5)'],

		['hsl(from lch(0 20 180) h s l)', 'color(srgb -0.13099833 0.05952886 -0.00460494)'],
		['hsl(from lch(20 0 180) h s l)', 'hsl(none 0% 18.93757452%)'],
		['hsl(from lch(20 20 0) h s l)', 'color(srgb 0.2923664 0.14058899 0.19244775)'],
		['hsl(from lch(0 0 180) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from lch(20 0 0) h s l)', 'hsl(none 0% 18.93757452%)'],
		['hsl(from lch(0 20 0) h s l)', 'color(srgb 0.13099833 -0.05952886 0.00460494)'],
		['hsl(from lch(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from lch(20 0.0015 180) h s l)', 'hsl(none 0% 18.93757452%)'],
		['hsl(from lch(20 0.00151 180) h s l)', 'color(srgb 0.18936676 0.18937855 0.18937554)'],

		['hsl(from oklch(0 0.2 180) h s l)', 'color(srgb -0.0266189 0.00845442 0.00006795)'],
		['hsl(from oklch(0.2 0 180) h s l)', 'hsl(none 0% 8.61042044%)'],
		['hsl(from oklch(0.2 0.2 0) h s l)', 'color(srgb 0.29595438 -0.12706564 0.07183401)'],
		['hsl(from oklch(0 0 180) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from oklch(0.2 0 0) h s l)', 'hsl(none 0% 8.61042044%)'],
		['hsl(from oklch(0 0.2 0) h s l)', 'color(srgb 0.0266189 -0.00845442 -0.00006795)'],
		['hsl(from oklch(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from oklch(0.2 0.000004 180) h s l)', 'hsl(none 0% 8.61042044%)'],
		['hsl(from oklch(0.2 0.0000041 180) h s l)', 'color(srgb 0.08609717 0.08610691 0.08610449)'],

		['hsl(from rgb(0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from color(display-p3 0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from lab(0 0 0) h s l)', 'hsl(none 0% 0%)'],
		['hsl(from oklab(0 0 0) h s l)', 'hsl(none 0% 0%)'],

		['hsl(from color(display-p3 0.50000333 0.49999445 0.49999517) h s l)', 'color(srgb 0.50000533 0.49999408 0.49999507)'],
		['hsl(from color(display-p3 0.49999645 0.50000513 0.50000531) h s l)', 'color(srgb 0.4999945 0.5000055 0.5000055)'],

		['color(from hsl(180 0% 50%) display-p3 r g b)', 'color(display-p3 0.5 0.5 0.5)'],
		['color(from hsl(180 0.001% 50%) display-p3 r g b)', 'color(display-p3 0.5 0.5 0.5)'],
		['color(from hsl(180 0.0011% 50%) display-p3 r g b)', 'color(display-p3 0.49999645 0.50000513 0.50000531)'],

		// HSL - color-mix
		['color-mix(in hsl, hsl(0 50% 50%), hsl(11 33 44))', 'color(srgb 0.66505 0.31070917 0.27495)', 'hsl(5.5 41.5% 47%)'],
		['color-mix(in hsl, hsl(180 0 50%), hsl(11 33 44))', 'color(srgb 0.54755 0.420885 0.39245)', 'hsl(11 16.5% 47%)'],
		['color-mix(in hsl, hsl(180 50% 0), hsl(11 33 44))', 'color(srgb 0.20326167 0.3113 0.1287)', 'hsl(95.5 41.5% 22%)'],
		['color-mix(in hsl, hsl(0 0 50%), hsl(11 33 44))', 'color(srgb 0.54755 0.420885 0.39245)', 'hsl(11 16.5% 47%)'],
		['color-mix(in hsl, hsl(180 0 0), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],
		['color-mix(in hsl, hsl(0 50% 0), hsl(11 33 44))', 'color(srgb 0.3113 0.14543833 0.1287)', 'hsl(5.5 41.5% 22%)'],
		['color-mix(in hsl, hsl(0 0 0), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],

		['color-mix(in hsl, hsl(180 0.001% 50%), hsl(11 33 44))', 'color(srgb 0.54755 0.420885 0.39245)', 'hsl(11 16.5% 47%)'],
		['color-mix(in hsl, hsl(180 0.0011% 50%), hsl(11 33 44))', 'color(srgb 0.45578203 0.54755258 0.39244742)', 'hsl(95.5 16.50055% 47%)'],

		['color-mix(in hsl, hwb(0 25% 25%), hsl(11 33 44))', 'color(srgb 0.66505 0.31070917 0.27495)', 'hsl(5.5 41.5% 47%)'],
		['color-mix(in hsl, hwb(180 100% 25%), hsl(11 33 44))', 'color(srgb 0.6827 0.58029 0.5573)', 'hsl(11 16.5% 62%)'],
		['color-mix(in hsl, hwb(180 25% 100%), hsl(11 33 44))', 'color(srgb 0.3728 0.28656 0.2672)', 'hsl(11 16.5% 32%)'],
		['color-mix(in hsl, hwb(0 100% 25%), hsl(11 33 44))', 'color(srgb 0.6827 0.58029 0.5573)', 'hsl(11 16.5% 62%)'],
		['color-mix(in hsl, hwb(180 100% 100%), hsl(11 33 44))', 'color(srgb 0.54755 0.420885 0.39245)', 'hsl(11 16.5% 47%)'],
		['color-mix(in hsl, hwb(0 25% 100%), hsl(11 33 44))', 'color(srgb 0.3728 0.28656 0.2672)', 'hsl(11 16.5% 32%)'],
		['color-mix(in hsl, hwb(0 100% 100%), hsl(11 33 44))', 'color(srgb 0.54755 0.420885 0.39245)', 'hsl(11 16.5% 47%)'],

		['color-mix(in hsl, hwb(180 49.999% 50%), hsl(11 33 44))', 'color(srgb 0.54754418 0.42088052 0.39244583)', 'hsl(11 16.5% 46.9995%)'],
		['color-mix(in hsl, hwb(180 49.998% 50%), hsl(11 33 44))', 'color(srgb 0.45577679 0.54754888 0.39244112)', 'hsl(95.5 16.50100002% 46.9995%)'],

		['color-mix(in hsl, lch(0 20 180), hsl(11 33 44))', 'color(srgb 0.50491258 -0.10064731 -0.05423751)', 'hsl(355.40163067 149.79270905% 20.21326326%)'],
		['color-mix(in hsl, lch(20 0 180), hsl(11 33 44))', 'color(srgb 0.36661137 0.28180299 0.26276437)', 'hsl(11 16.5% 31.46878726%)'],
		['color-mix(in hsl, lch(20 20 0), hsl(11 33 44))', 'color(srgb 0.43993218 0.21654551 0.23423138)', 'hsl(355.24970702 34.02806641% 32.82388472%)'],
		['color-mix(in hsl, lch(0 0 180), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],
		['color-mix(in hsl, lch(20 0 0), hsl(11 33 44))', 'color(srgb 0.36661137 0.28180299 0.26276437)', 'hsl(11 16.5% 31.46878726%)'],
		['color-mix(in hsl, lch(0 20 0), hsl(11 33 44))', 'color(srgb 0.59417534 -0.11844061 -0.06382608)', 'hsl(355.40163067 149.79270905% 23.78673674%)'],
		['color-mix(in hsl, lch(0 0 0), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],

		['color-mix(in hsl, lch(20 0.0015 180), hsl(11 33 44))', 'color(srgb 0.36661137 0.28180299 0.26276437)', 'hsl(11 16.5% 31.46878726%)'],
		['color-mix(in hsl, lch(20 0.00151 180), hsl(11 33 44))', 'color(srgb 0.31843217 0.36661447 0.26275819)', 'hsl(87.83594462 16.50155639% 31.4686328%)'],

		['color-mix(in hsl, oklch(0 0.2 180), hsl(11 33 44))', 'color(srgb 0.45902161 -0.02810385 -0.01451808)', 'hsl(358.32661994 113.04371959% 21.54588801%)'],
		['color-mix(in hsl, oklch(0.2 0 180), hsl(11 33 44))', 'color(srgb 0.3064557 0.23556316 0.21964851)', 'hsl(11 16.5% 26.30521022%)'],
		['color-mix(in hsl, oklch(0.2 0.2 0), hsl(11 33 44))', 'color(srgb 0.63388622 -0.10944185 -0.00282766)', 'hsl(351.39430933 141.73630395% 26.22221843%)'],
		['color-mix(in hsl, oklch(0 0 180), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],
		['color-mix(in hsl, oklch(0.2 0 0), hsl(11 33 44))', 'color(srgb 0.3064557 0.23556316 0.21964851)', 'hsl(11 16.5% 26.30521022%)'],
		['color-mix(in hsl, oklch(0 0.2 0), hsl(11 33 44))', 'color(srgb 0.47837075 -0.02928851 -0.01513007)', 'hsl(358.32661994 113.04371959% 22.454112%)'],
		['color-mix(in hsl, oklch(0 0 0), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],

		['color-mix(in hsl, oklch(0.2 0.000004 180), hsl(11 33 44))', 'color(srgb 0.3064557 0.23556316 0.21964851)', 'hsl(11 16.5% 26.30521022%)'],
		['color-mix(in hsl, oklch(0.2 0.0000041 180), hsl(11 33 44))', 'color(srgb 0.26585563 0.30646187 0.21964017)', 'hsl(88.06181129 16.5028262% 26.30510205%)'],

		['color-mix(in hsl, rgb(0 0 0), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],
		['color-mix(in hsl, color(display-p3 0 0 0), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],
		['color-mix(in hsl, lab(0 0 0), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],
		['color-mix(in hsl, oklab(0 0 0), hsl(11 33 44))', 'color(srgb 0.2563 0.19701 0.1837)', 'hsl(11 16.5% 22%)'],

		['color-mix(in hsl, color(display-p3 0.50000333 0.49999445 0.49999517), hsl(11 33 44))', 'color(srgb 0.54755247 0.39984221 0.39244723)', 'hsl(362.86063009 16.50056255% 46.9999851%)'],
		['color-mix(in hsl, color(display-p3 0.49999645 0.50000513 0.50000531), hsl(11 33 44))', 'color(srgb 0.45576023 0.54755258 0.39244741)', 'hsl(95.50842958 16.50055003% 46.99999989%)'],

		// HWB - RCS
		['hwb(from hsl(0 50% 50%) h w b)', 'color(srgb 0.75 0.25 0.25)'],
		['hwb(from hsl(180 0 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 50% 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 0 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 50% 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hsl(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from hsl(180 0.001% 50%) h w b)', 'hwb(none 50% 50%)'],
		['hwb(from hsl(180 0.0011% 50%) h w b)', 'color(srgb 0.4999945 0.5000055 0.5000055)'],

		['hwb(from hwb(0 25% 25%) h w b)', 'color(srgb 0.75 0.25 0.25)'],
		['hwb(from hwb(180 100% 25%) h w b)', 'color(srgb 0.8 0.8 0.8)'],
		['hwb(from hwb(180 25% 100%) h w b)', 'color(srgb 0.2 0.2 0.2)'],
		['hwb(from hwb(0 100% 25%) h w b)', 'color(srgb 0.8 0.8 0.8)'],
		['hwb(from hwb(180 100% 100%) h w b)', 'color(srgb 0.5 0.5 0.5)'],
		['hwb(from hwb(0 25% 100%) h w b)', 'color(srgb 0.2 0.2 0.2)'],
		['hwb(from hwb(0 100% 100%) h w b)', 'color(srgb 0.5 0.5 0.5)'],

		['hwb(from hwb(180 99.999% 0%) h w b)', 'color(srgb 0.99999 0.99999 0.99999)'],
		['hwb(from hwb(180 99.999% none) h w b)', 'hwb(180 99.999% none)'],
		['hwb(from hsl(from hwb(180 99.999% none) h s l) h w b)', 'hwb(none 100% 0%)'],
		['hwb(from hwb(180 99.998% 0%) h w b)', 'color(srgb 0.99998 1 1)'],
		['hwb(from hwb(180 0% 99.999%) h w b)', 'color(srgb 0 0 0)'],
		['hwb(from hwb(180 none 99.999%) h w b)', 'hwb(180 none 99.999%)'],
		['hwb(from hsl(from hwb(180 none 99.999%) h s l) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from hwb(180 0% 99.998%) h w b)', 'color(srgb 0 0.00002 0.00002)'],
		['hwb(from hwb(180 49.999% 50%) h w b)', 'color(srgb 0.49999 0.49999 0.49999)'],
		['hwb(from hwb(180 49.998% 50%) h w b)', 'color(srgb 0.49998 0.5 0.5)'],

		['hwb(from lch(0 20 180) h w b)', 'color(srgb -0.13099833 0.05952886 -0.00460494)'],
		['hwb(from lch(20 0 180) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(20 20 0) h w b)', 'color(srgb 0.2923664 0.14058899 0.19244775)'],
		['hwb(from lch(0 0 180) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from lch(20 0 0) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(0 20 0) h w b)', 'color(srgb 0.13099833 -0.05952886 0.00460494)'],
		['hwb(from lch(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from lch(20 0.0015 180) h w b)', 'hwb(none 18.93757452% 81.06242548%)'],
		['hwb(from lch(20 0.00151 180) h w b)', 'color(srgb 0.18936676 0.18937855 0.18937554)'],

		['hwb(from oklch(0 0.2 180) h w b)', 'color(srgb -0.0266189 0.00845442 0.00006795)'],
		['hwb(from oklch(0.2 0 180) h w b)', 'hwb(none 8.61042044% 91.38957956%)'],
		['hwb(from oklch(0.2 0.2 0) h w b)', 'color(srgb 0.29595438 -0.12706564 0.07183401)'],
		['hwb(from oklch(0 0 180) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from oklch(0.2 0 0) h w b)', 'hwb(none 8.61042044% 91.38957956%)'],
		['hwb(from oklch(0 0.2 0) h w b)', 'color(srgb 0.0266189 -0.00845442 -0.00006795)'],
		['hwb(from oklch(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from oklch(0.8 0.000004 180) h w b)', 'hwb(none 74.3205918% 25.6794082%)'],
		['hwb(from oklch(0.8 0.0000041 180) h w b)', 'color(srgb 0.74319598 0.74320974 0.74320633)'],

		['hwb(from rgb(0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from color(display-p3 0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from lab(0 0 0) h w b)', 'hwb(none 0% 100%)'],
		['hwb(from oklab(0 0 0) h w b)', 'hwb(none 0% 100%)'],

		['hwb(from color(display-p3 0.50000333 0.49999445 0.49999517) h w b)', 'color(srgb 0.50000533 0.49999408 0.49999507)'],
		['hwb(from color(display-p3 0.49999645 0.50000513 0.50000531) h w b)', 'color(srgb 0.4999945 0.5000055 0.5000055)'],

		['color(from hwb(180 50% 50%) display-p3 r g b)', 'color(display-p3 0.5 0.5 0.5)'],
		['color(from hwb(180 49.999% 50%) display-p3 r g b)', 'color(display-p3 0.49999 0.49999 0.49999)'],
		['color(from hwb(180 49.998% 50%) display-p3 r g b)', 'color(display-p3 0.49998355 0.49999934 0.49999966)'],

		// HWB - powerless
		['color-mix(in hwb, hsl(0 50% 50%), hwb(11 33 44))', 'color(srgb 0.655 0.32345833 0.29)', 'hwb(5.5 29% 34.5%)'],
		['color-mix(in hwb, hsl(180 0 50%), hwb(11 33 44))', 'color(srgb 0.53 0.43608333 0.415)', 'hwb(11 41.5% 47%)'],
		['color-mix(in hwb, hsl(180 50% 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, hsl(0 0 50%), hwb(11 33 44))', 'color(srgb 0.53 0.43608333 0.415)', 'hwb(11 41.5% 47%)'],
		['color-mix(in hwb, hsl(180 0 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, hsl(0 50% 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, hsl(0 0 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],

		['color-mix(in hwb, hsl(180 0.001% 50%), hwb(11 33 44))', 'color(srgb 0.53 0.43608333 0.415)', 'hwb(11 41.5% 47%)'],
		['color-mix(in hwb, hsl(180 0.0011% 50%), hwb(11 33 44))', 'color(srgb 0.46195783 0.53000275 0.41499725)', 'hwb(95.5 41.499725% 46.999725%)'],

		['color-mix(in hwb, hwb(0 25% 25%), hwb(11 33 44))', 'color(srgb 0.655 0.32345833 0.29)', 'hwb(5.5 29% 34.5%)'],
		['color-mix(in hwb, hwb(180 100% 25%), hwb(11 33 44))', 'color(srgb 0.65841584 0.65841584 0.65841584)', 'hwb(11 66.5% 34.5%)'],
		['color-mix(in hwb, hwb(180 25% 100%), hwb(11 33 44))', 'color(srgb 0.28712871 0.28712871 0.28712871)', 'hwb(11 29% 72%)'],
		['color-mix(in hwb, hwb(0 100% 25%), hwb(11 33 44))', 'color(srgb 0.65841584 0.65841584 0.65841584)', 'hwb(11 66.5% 34.5%)'],
		['color-mix(in hwb, hwb(180 100% 100%), hwb(11 33 44))', 'color(srgb 0.4801444 0.4801444 0.4801444)', 'hwb(11 66.5% 72%)'],
		['color-mix(in hwb, hwb(0 25% 100%), hwb(11 33 44))', 'color(srgb 0.28712871 0.28712871 0.28712871)', 'hwb(11 29% 72%)'],
		['color-mix(in hwb, hwb(0 100% 100%), hwb(11 33 44))', 'color(srgb 0.4801444 0.4801444 0.4801444)', 'hwb(11 66.5% 72%)'],

		['color-mix(in hwb, hwb(180 99.999% 0%), hwb(11 33 44))', 'color(srgb 0.779995 0.68607833 0.664995)', 'hwb(11 66.4995% 22.0005%)'],
		['color-mix(in hwb, hwb(180 99.999% none), hwb(11 33 44))', 'color(srgb 0.60180995 0.60180995 0.60180995)', 'hwb(11 66.5% 44%)'],
		['color-mix(in hwb, hsl(from hwb(180 99.999% none) h s l), hwb(11 33 44))', 'color(srgb 0.78 0.68608333 0.665)', 'hwb(11 66.5% 22%)'],
		['color-mix(in hwb, hwb(180 99.998% 0%), hwb(11 33 44))', 'color(srgb 0.71195242 0.78 0.66499)', 'hwb(95.5 66.499% 22%)'],
		['color-mix(in hwb, hwb(180 0% 99.999%), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, hwb(180 none 99.999%), hwb(11 33 44))', 'color(srgb 0.31428571 0.31428571 0.31428571)', 'hwb(11 33% 72%)'],
		['color-mix(in hwb, hsl(from hwb(180 none 99.999%) h s l), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, hwb(180 0% 99.998%), hwb(11 33 44))', 'color(srgb 0.21196242 0.28001 0.165)', 'hwb(95.5 16.5% 71.999%)'],
		['color-mix(in hwb, hwb(180 49.999% 50%), hwb(11 33 44))', 'color(srgb 0.529995 0.43607833 0.414995)', 'hwb(11 41.4995% 47.0005%)'],
		['color-mix(in hwb, hwb(180 49.998% 50%), hwb(11 33 44))', 'color(srgb 0.46195242 0.53 0.41499)', 'hwb(95.5 41.499% 47%)'],

		['color-mix(in hwb, lch(0 20 180), hwb(11 33 44))', 'color(srgb 0.22074713 0.30976443 0.09950084)', 'hwb(85.40163067 9.95008365% 69.02355713%)'],
		['color-mix(in hwb, lch(20 0 180), hwb(11 33 44))', 'color(srgb 0.37468787 0.28077121 0.25968787)', 'hwb(11 25.96878726% 62.53121274%)'],
		['color-mix(in hwb, lch(20 20 0), hwb(11 33 44))', 'color(srgb 0.4261832 0.23529449 0.25040745)', 'hwb(355.24970702 23.52944932% 57.38167989%)'],
		['color-mix(in hwb, lch(0 0 180), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, lch(20 0 0), hwb(11 33 44))', 'color(srgb 0.37468787 0.28077121 0.25968787)', 'hwb(11 25.96878726% 62.53121274%)'],
		['color-mix(in hwb, lch(0 20 0), hwb(11 33 44))', 'color(srgb 0.34549916 0.13523557 0.15135007)', 'hwb(355.40163067 13.52355713% 65.45008365%)'],
		['color-mix(in hwb, lch(0 0 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],

		['color-mix(in hwb, lch(20 0.0015 180), hwb(11 33 44))', 'color(srgb 0.37468787 0.28077121 0.25968787)', 'hwb(11 25.96878726% 62.53121274%)'],
		['color-mix(in hwb, lch(20 0.00151 180), hwb(11 33 44))', 'color(srgb 0.32133431 0.37468928 0.25968338)', 'hwb(87.83594462 25.96833806% 62.53107246%)'],

		['color-mix(in hwb, oklch(0 0.2 180), hwb(11 33 44))', 'color(srgb 0.22165528 0.28422721 0.15169055)', 'hwb(88.32661994 15.16905478% 71.57727877%)'],
		['color-mix(in hwb, oklch(0.2 0 180), hwb(11 33 44))', 'color(srgb 0.3230521 0.22913544 0.2080521)', 'hwb(11 20.80521022% 67.69478978%)'],
		['color-mix(in hwb, oklch(0.2 0.2 0), hwb(11 33 44))', 'color(srgb 0.42797719 0.10146718 0.14829791)', 'hwb(351.39430933 10.14671781% 57.20228096%)'],
		['color-mix(in hwb, oklch(0 0 180), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, oklch(0.2 0 0), hwb(11 33 44))', 'color(srgb 0.3230521 0.22913544 0.2080521)', 'hwb(11 20.80521022% 67.69478978%)'],
		['color-mix(in hwb, oklch(0 0.2 0), hwb(11 33 44))', 'color(srgb 0.29330945 0.16077279 0.16446919)', 'hwb(358.32661994 16.07727877% 70.66905478%)'],
		['color-mix(in hwb, oklch(0 0 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],

		['color-mix(in hwb, oklch(0.8 0.000004 180), hwb(11 33 44))', 'color(srgb 0.65160296 0.55768629 0.53660296)', 'hwb(11 53.6602959% 34.8397041%)'],
		['color-mix(in hwb, oklch(0.8 0.0000041 180), hwb(11 33 44))', 'color(srgb 0.5978169 0.65160487 0.53659799)', 'hwb(88.06161125 53.6597988% 34.83951294%)'],

		['color-mix(in hwb, rgb(0 0 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, color(display-p3 0 0 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, lab(0 0 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],
		['color-mix(in hwb, oklab(0 0 0), hwb(11 33 44))', 'color(srgb 0.28 0.18608333 0.165)', 'hwb(11 16.5% 72%)'],

		['color-mix(in hwb, color(display-p3 0.50000333 0.49999445 0.49999517), hwb(11 33 44))', 'color(srgb 0.53000266 0.42048018 0.41499704)', 'hwb(362.86063009 41.49970382% 46.99973363%)'],
		['color-mix(in hwb, color(display-p3 0.49999645 0.50000513 0.50000531), hwb(11 33 44))', 'color(srgb 0.46194167 0.53000275 0.41499725)', 'hwb(95.50842958 41.49972488% 46.9997251%)'],

		// LCH - RCS
		['lch(from hsl(0 50% 50%) l c h)', 'lch(46.42043661 59.74639249 29.95665674)'],
		['lch(from hsl(180 0 50%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hsl(180 50% 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 0 50%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hsl(180 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 50% 0) l c h)', 'lch(0 0 none)'],
		['lch(from hsl(0 0 0) l c h)', 'lch(0 0 none)'],

		['lch(from hsl(180 0.001% 50%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hsl(180 0.0011% 50%) l c h)', 'lch(53.38927006 0 none)'],

		['lch(from hwb(0 25% 25%) l c h)', 'lch(46.42043661 59.74639249 29.95665674)'],
		['lch(from hwb(180 100% 25%) l c h)', 'lch(82.04578167 0 none)'],
		['lch(from hwb(180 25% 100%) l c h)', 'lch(21.24673129 0 none)'],
		['lch(from hwb(0 100% 25%) l c h)', 'lch(82.04578167 0 none)'],
		['lch(from hwb(180 100% 100%) l c h)', 'lch(53.38896474 0 none)'],
		['lch(from hwb(0 25% 100%) l c h)', 'lch(21.24673129 0 none)'],
		['lch(from hwb(0 100% 100%) l c h)', 'lch(53.38896474 0 none)'],

		['lch(from hwb(180 99.999% 0%) l c h)', 'lch(99.99912038 0 none)'],
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

		['lch(from oklch(0.2 0.000004 180) l c h)', 'lch(7.22637037 0 none)'],
		['lch(from oklch(0.2 0.0000041 180) l c h)', 'lch(7.22641849 0 none)'],

		['lch(from rgb(0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from color(display-p3 0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from lab(0 0 0) l c h)', 'lch(0 0 none)'],
		['lch(from oklab(0 0 0) l c h)', 'lch(0 0 none)'],

		['lch(from color(display-p3 0.1893689 0.18937814 0.18937561) l c h)', 'lch(19.99999973 0 none)'],
		['lch(from color(display-p3 0.18936885 0.18937816 0.18937561) l c h)', 'lch(19.99999994 0.00151062 180.02568063)'],

		['color(from lch(20 0 180) display-p3 r g b)', 'color(display-p3 0.18937575 0.18937575 0.18937575)'],
		['color(from lch(20 0.0015 180) display-p3 r g b)', 'color(display-p3 0.18937575 0.18937575 0.18937575)'],
		['color(from lch(20 0.00151 180) display-p3 r g b)', 'color(display-p3 0.18936885 0.18937816 0.18937561)'],

		// LCH - color-mix
		['color-mix(in lch, hsl(0 50% 50%), lch(11 33 44))', 'lch(28.71021831 46.37319624 36.97832837)'],
		['color-mix(in lch, hsl(180 0 50%), lch(11 33 44))', 'lch(32.19448237 16.5 44)'],
		['color-mix(in lch, hsl(180 50% 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],
		['color-mix(in lch, hsl(0 0 50%), lch(11 33 44))', 'lch(32.19448237 16.5 44)'],
		['color-mix(in lch, hsl(180 0 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],
		['color-mix(in lch, hsl(0 50% 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],
		['color-mix(in lch, hsl(0 0 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],

		['color-mix(in lch, hsl(180 0.001% 50%), lch(11 33 44))', 'lch(32.19448237 16.5 44)'],
		['color-mix(in lch, hsl(180 0.0011% 50%), lch(11 33 44))', 'lch(32.19463503 16.5 44)'],

		['color-mix(in lch, hwb(0 25% 25%), lch(11 33 44))', 'lch(28.71021831 46.37319624 36.97832837)'],
		['color-mix(in lch, hwb(180 100% 25%), lch(11 33 44))', 'lch(46.52289084 16.5 44)'],
		['color-mix(in lch, hwb(180 25% 100%), lch(11 33 44))', 'lch(16.12336565 16.5 44)'],
		['color-mix(in lch, hwb(0 100% 25%), lch(11 33 44))', 'lch(46.52289084 16.5 44)'],
		['color-mix(in lch, hwb(180 100% 100%), lch(11 33 44))', 'lch(32.19448237 16.5 44)'],
		['color-mix(in lch, hwb(0 25% 100%), lch(11 33 44))', 'lch(16.12336565 16.5 44)'],
		['color-mix(in lch, hwb(0 100% 100%), lch(11 33 44))', 'lch(32.19448237 16.5 44)'],

		['color-mix(in lch, hwb(180 99.999% 0%), lch(11 33 44))', 'lch(55.49956019 16.5 44)'],
		['color-mix(in lch, hwb(180 99.998% 0%), lch(11 33 44))', 'lch(55.49980429 16.50092511 121.84949895)'],

		['color-mix(in lch, lch(0 20 180), lch(11 33 44))', 'lch(5.5 26.5 112)'],
		['color-mix(in lch, lch(20 0 180), lch(11 33 44))', 'lch(15.5 16.5 44)'],
		['color-mix(in lch, lch(20 20 0), lch(11 33 44))', 'lch(15.5 26.5 22)'],
		['color-mix(in lch, lch(0 0 180), lch(11 33 44))', 'lch(5.5 16.5 44)'],
		['color-mix(in lch, lch(20 0 0), lch(11 33 44))', 'lch(15.5 16.5 44)'],
		['color-mix(in lch, lch(0 20 0), lch(11 33 44))', 'lch(5.5 26.5 22)'],
		['color-mix(in lch, lch(0 0 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],

		['color-mix(in lch, lch(20 0.0015 180), lch(11 33 44))', 'lch(15.5 16.5 44)'],
		['color-mix(in lch, lch(20 0.00151 180), lch(11 33 44))', 'lch(15.5 16.500755 112)'],

		['color-mix(in lch, oklch(0 0.2 180), lch(11 33 44))', 'lch(5.50498007 17.8251974 112.60184783)'],
		['color-mix(in lch, oklch(0.2 0 180), lch(11 33 44))', 'lch(9.11318519 16.5 44)'],
		['color-mix(in lch, oklch(0.2 0.2 0), lch(11 33 44))', 'lch(8.05436608 46.24412025 22.62103659)'],
		['color-mix(in lch, oklch(0 0 180), lch(11 33 44))', 'lch(5.5 16.5 44)'],
		['color-mix(in lch, oklch(0.2 0 0), lch(11 33 44))', 'lch(9.11318519 16.5 44)'],
		['color-mix(in lch, oklch(0 0.2 0), lch(11 33 44))', 'lch(5.49501993 17.8251974 22.60184783)'],
		['color-mix(in lch, oklch(0 0 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],

		['color-mix(in lch, oklch(0.2 0.000004 180), lch(11 33 44))', 'lch(9.11318519 16.5 44)'],
		['color-mix(in lch, oklch(0.2 0.0000041 180), lch(11 33 44))', 'lch(9.11320925 16.5 44)'],

		['color-mix(in lch, rgb(0 0 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],
		['color-mix(in lch, color(display-p3 0 0 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],
		['color-mix(in lch, lab(0 0 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],
		['color-mix(in lch, oklab(0 0 0), lch(11 33 44))', 'lch(5.5 16.5 44)'],

		['color-mix(in lch, color(display-p3 0.1893689 0.18937814 0.18937561), lch(11 33 44))', 'lch(15.49999987 16.5 44)'],
		['color-mix(in lch, color(display-p3 0.18936885 0.18937816 0.18937561), lch(11 33 44))', 'lch(15.49999997 16.50075531 112.01284031)'],

		// oklch - RCS
		['oklch(from hsl(0 50% 50%) l c h)', 'oklch(0.55233858 0.16366995 24.21253898)'],
		['oklch(from hsl(180 0 50%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hsl(180 50% 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 0 50%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hsl(180 0 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 50% 0) l c h)', 'oklch(0 0 none)'],
		['oklch(from hsl(0 0 0) l c h)', 'oklch(0 0 none)'],

		['oklch(from hsl(180 0.001% 50%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hsl(180 0.0011% 50%) l c h)', 'oklch(0.59818306 0 none)'],

		['oklch(from hwb(0 25% 25%) l c h)', 'oklch(0.55233858 0.16366995 24.21253898)'],
		['oklch(from hwb(180 100% 25%) l c h)', 'oklch(0.84522226 0 none)'],
		['oklch(from hwb(180 25% 100%) l c h)', 'oklch(0.32109251 0 none)'],
		['oklch(from hwb(0 100% 25%) l c h)', 'oklch(0.84522226 0 none)'],
		['oklch(from hwb(180 100% 100%) l c h)', 'oklch(0.59818073 0 none)'],
		['oklch(from hwb(0 25% 100%) l c h)', 'oklch(0.32109251 0 none)'],
		['oklch(from hwb(0 100% 100%) l c h)', 'oklch(0.59818073 0 none)'],

		['oklch(from hwb(180 99.999% 0%) l c h)', 'oklch(0.99999242 0 none)'],
		['oklch(from hwb(180 99.998% 0%) l c h)', 'oklch(0.99999614 0.00000541 197.15830446)'],

		['oklch(from lch(0 20 180) l c h)', 'oklch(0 0.26412556 175.27132911)'],
		['oklch(from lch(20 0 180) l c h)', 'oklch(0.31034483 0 none)'],
		['oklch(from lch(20 20 0) l c h)', 'oklch(0.31697196 0.06085528 359.39300302)'],
		['oklch(from lch(0 0 180) l c h)', 'oklch(0 0 none)'],
		['oklch(from lch(20 0 0) l c h)', 'oklch(0.31034483 0 none)'],
		['oklch(from lch(0 20 0) l c h)', 'oklch(0.05666101 0.26412556 355.27132911)'],
		['oklch(from lch(0 0 0) l c h)', 'oklch(0 0 none)'],

		['oklch(from lch(20 0.0015 180) l c h)', 'oklch(0.31034483 0 none)'],
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

		['oklch(from color(display-p3 0.08610937692934956 0.08610188202042188 0.08610387292083356) l c h)', 'oklch(0.2 0.000004 359.99999992)'],
		['oklch(from color(display-p3 0.0860989 0.08610658 0.08610454) l c h)', 'oklch(0.2 0.0000041 179.99967542)'],

		['color(from oklch(0.5 0 180) display-p3 r g b)', 'color(display-p3 0.38857286 0.38857286 0.38857286)'],
		['color(from oklch(0.5 0.000004 180) display-p3 r g b)', 'color(display-p3 0.38857286 0.38857286 0.38857286)'],
		['color(from oklch(0.5 0.0000041 180) display-p3 r g b)', 'color(display-p3 0.38856619 0.38857585 0.38857329)'],

		// oklch - color-mix
		['color-mix(in oklch, hsl(0 50% 50%), oklch(0.11 0.33 0.44))', 'oklch(0.33116929 0.24683498 12.32626949)'],
		['color-mix(in oklch, hsl(180 0 50%), oklch(0.11 0.33 0.44))', 'oklch(0.35409037 0.165 0.44)'],
		['color-mix(in oklch, hsl(180 50% 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],
		['color-mix(in oklch, hsl(0 0 50%), oklch(0.11 0.33 0.44))', 'oklch(0.35409037 0.165 0.44)'],
		['color-mix(in oklch, hsl(180 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],
		['color-mix(in oklch, hsl(0 50% 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],
		['color-mix(in oklch, hsl(0 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],

		['color-mix(in oklch, hsl(180 0.001% 50%), oklch(0.11 0.33 0.44))', 'oklch(0.35409037 0.165 0.44)'],
		['color-mix(in oklch, hsl(180 0.0011% 50%), oklch(0.11 0.33 0.44))', 'oklch(0.35409153 0.165 0.44)'],

		['color-mix(in oklch, hwb(0 25% 25%), oklch(0.11 0.33 0.44))', 'oklch(0.33116929 0.24683498 12.32626949)'],
		['color-mix(in oklch, hwb(180 100% 25%), oklch(0.11 0.33 0.44))', 'oklch(0.47761113 0.165 0.44)'],
		['color-mix(in oklch, hwb(180 25% 100%), oklch(0.11 0.33 0.44))', 'oklch(0.21554626 0.165 0.44)'],
		['color-mix(in oklch, hwb(0 100% 25%), oklch(0.11 0.33 0.44))', 'oklch(0.47761113 0.165 0.44)'],
		['color-mix(in oklch, hwb(180 100% 100%), oklch(0.11 0.33 0.44))', 'oklch(0.35409037 0.165 0.44)'],
		['color-mix(in oklch, hwb(0 25% 100%), oklch(0.11 0.33 0.44))', 'oklch(0.21554626 0.165 0.44)'],
		['color-mix(in oklch, hwb(0 100% 100%), oklch(0.11 0.33 0.44))', 'oklch(0.35409037 0.165 0.44)'],

		['color-mix(in oklch, hwb(180 99.999% 0%), oklch(0.11 0.33 0.44))', 'oklch(0.55499621 0.165 0.44)'],
		['color-mix(in oklch, hwb(180 99.998% 0%), oklch(0.11 0.33 0.44))', 'oklch(0.55499807 0.1650027 278.79915223)'],

		['color-mix(in oklch, lch(0 20 180), oklch(0.11 0.33 0.44))', 'oklch(0.02666949 0.29706278 87.85566456)'],
		['color-mix(in oklch, lch(20 0 180), oklch(0.11 0.33 0.44))', 'oklch(0.21017241 0.165 0.44)'],
		['color-mix(in oklch, lch(20 20 0), oklch(0.11 0.33 0.44))', 'oklch(0.21348598 0.19542764 359.91650151)'],
		['color-mix(in oklch, lch(0 0 180), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],
		['color-mix(in oklch, lch(20 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.21017241 0.165 0.44)'],
		['color-mix(in oklch, lch(0 20 0), oklch(0.11 0.33 0.44))', 'oklch(0.08333051 0.29706278 357.85566456)'],
		['color-mix(in oklch, lch(0 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],

		['color-mix(in oklch, lch(20 0.0015 180), oklch(0.11 0.33 0.44))', 'oklch(0.21017241 0.165 0.44)'],
		['color-mix(in oklch, lch(20 0.00151 180), oklch(0.11 0.33 0.44))', 'oklch(0.21017217 0.16500223 89.97450216)'],

		['color-mix(in oklch, oklch(0 0.2 180), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.265 90.22)'],
		['color-mix(in oklch, oklch(0.2 0 180), oklch(0.11 0.33 0.44))', 'oklch(0.155 0.165 0.44)'],
		['color-mix(in oklch, oklch(0.2 0.2 0), oklch(0.11 0.33 0.44))', 'oklch(0.155 0.265 0.22)'],
		['color-mix(in oklch, oklch(0 0 180), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],
		['color-mix(in oklch, oklch(0.2 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.155 0.165 0.44)'],
		['color-mix(in oklch, oklch(0 0.2 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.265 0.22)'],
		['color-mix(in oklch, oklch(0 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],

		['color-mix(in oklch, oklch(0.2 0.000004 180), oklch(0.11 0.33 0.44))', 'oklch(0.155 0.165 0.44)'],
		['color-mix(in oklch, oklch(0.2 0.0000041 180), oklch(0.11 0.33 0.44))', 'oklch(0.155 0.16500205 90.22)'],

		['color-mix(in oklch, rgb(0 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],
		['color-mix(in oklch, color(display-p3 0 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],
		['color-mix(in oklch, lab(0 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],
		['color-mix(in oklch, oklab(0 0 0), oklch(0.11 0.33 0.44))', 'oklch(0.055 0.165 0.44)'],

		['color-mix(in oklch, color(display-p3 0.08610937692934956 0.08610188202042188 0.08610387292083356), oklch(0.11 0.33 0.44))', 'oklch(0.155 0.165002 360.21999996)'],
		['color-mix(in oklch, color(display-p3 0.0860989 0.08610658 0.08610454), oklch(0.11 0.33 0.44))', 'oklch(0.155 0.16500205 90.21983771)'],
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			reducePrecisionWholeValue(computedValue(test[0])),
			test[1],
			`"${test[0]}" : ${test[1]}`,
		);
	}
}
