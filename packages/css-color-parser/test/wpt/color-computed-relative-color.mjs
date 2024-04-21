import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';
import { canonicalize } from '../util/canonical.mjs';

const tests = [
	['rgb(from rebeccapurple r g b)', 'rgb(102, 51, 153)'],
	['rgb(from rebeccapurple r g b / alpha)', 'rgb(102, 51, 153)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r g b / alpha)', 'rgba(51, 102, 153, 0.8)'],
	['rgb(from hsl(120deg 20% 50% / .5) r g b / alpha)', 'rgba(102, 153, 102, 0.5)'],

	// Test nesting relative colors.
	['rgb(from rgb(from rebeccapurple r g b) r g b)', 'rgb(102, 51, 153)'],

	// Testing non-sRGB origin colors to see gamut mapping.
	['rgb(from color(display-p3 0 1 0) r g b / alpha)', 'rgb(0, 247, 79)'], // Naive clip based mapping would give rgb(0, 255, 0).
	['rgb(from lab(100 104.3 -50.9) r g b)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 150, 255).
	['rgb(from lab(0 104.3 -50.9) r g b)', 'rgb(38, 0, 31)'], // Naive clip based mapping would give rgb(90, 0, 76). NOTE: 0% lightness in Lab/LCH does not automatically correspond with sRGB black,
	['rgb(from lch(100 116 334) r g b)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 150, 255).
	['rgb(from lch(0 116 334) r g b)', 'rgb(38, 0, 31)'], // Naive clip based mapping would give rgb(90, 0, 76). NOTE: 0% lightness in Lab/LCH does not automatically correspond with sRGB black,
	['rgb(from oklab(1 0.365 -0.16) r g b)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 92, 255).
	['rgb(from oklab(0 0.365 -0.16) r g b)', 'rgb(0, 0, 0)'], // Naive clip based mapping would give rgb(19, 0, 24).
	['rgb(from oklch(1 0.399 336.3) r g b)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 91, 255).
	['rgb(from oklch(0 0.399 336.3) r g b)', 'rgb(0, 0, 0)'], // Naive clip based mapping would give rgb(20, 0, 24).

	// Testing replacement with 0.
	['rgb(from rebeccapurple 0 0 0)', 'rgb(0, 0, 0)'],
	['rgb(from rebeccapurple 0 0 0 / 0)', 'rgba(0, 0, 0, 0)'],
	['rgb(from rebeccapurple 0 g b / alpha)', 'rgb(0, 51, 153)'],
	['rgb(from rebeccapurple r 0 b / alpha)', 'rgb(102, 0, 153)'],
	['rgb(from rebeccapurple r g 0 / alpha)', 'rgb(102, 51, 0)'],
	['rgb(from rebeccapurple r g b / 0)', 'rgba(102, 51, 153, 0)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) 0 g b / alpha)', 'rgba(0, 102, 153, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r 0 b / alpha)', 'rgba(51, 0, 153, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r g 0 / alpha)', 'rgba(51, 102, 0, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r g b / 0)', 'rgba(51, 102, 153, 0)'],

	// Testing replacement with a number.
	['rgb(from rebeccapurple 25 g b / alpha)', 'rgb(25, 51, 153)'],
	['rgb(from rebeccapurple r 25 b / alpha)', 'rgb(102, 25, 153)'],
	['rgb(from rebeccapurple r g 25 / alpha)', 'rgb(102, 51, 25)'],
	['rgb(from rebeccapurple r g b / .25)', 'rgba(102, 51, 153, 0.25)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) 25 g b / alpha)', 'rgba(25, 102, 153, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r 25 b / alpha)', 'rgba(51, 25, 153, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r g 25 / alpha)', 'rgba(51, 102, 25, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r g b / .20)', 'rgba(51, 102, 153, 0.2)'],

	// Testing replacement with a percentage.
	['rgb(from rebeccapurple 20% g b / alpha)', 'rgb(51, 51, 153)'],
	['rgb(from rebeccapurple r 20% b / alpha)', 'rgb(102, 51, 153)'],
	['rgb(from rebeccapurple r g 20% / alpha)', 'rgb(102, 51, 51)'],
	['rgb(from rebeccapurple r g b / 20%)', 'rgba(102, 51, 153, 0.2)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) 20% g b / alpha)', 'rgba(51, 102, 153, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r 20% b / alpha)', 'rgba(51, 51, 153, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r g 20% / alpha)', 'rgba(51, 102, 51, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r g b / 20%)', 'rgba(51, 102, 153, 0.2)'],

	// Testing replacement with a number for r, g, b but percent for alpha.
	['rgb(from rebeccapurple 25 g b / 25%)', 'rgba(25, 51, 153, 0.25)'],
	['rgb(from rebeccapurple r 25 b / 25%)', 'rgba(102, 25, 153, 0.25)'],
	['rgb(from rebeccapurple r g 25 / 25%)', 'rgba(102, 51, 25, 0.25)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) 25 g b / 25%)', 'rgba(25, 102, 153, 0.25)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r 25 b / 25%)', 'rgba(51, 25, 153, 0.25)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r g 25 / 25%)', 'rgba(51, 102, 25, 0.25)'],

	// Testing permutation.
	['rgb(from rebeccapurple g b r)', 'rgb(51, 153, 102)'],
	['rgb(from rebeccapurple b alpha r / g)', 'rgb(153, 1, 102)'],
	['rgb(from rebeccapurple r r r / r)', 'rgb(102, 102, 102)'],
	['rgb(from rebeccapurple alpha alpha alpha / alpha)', 'rgb(1, 1, 1)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) g b r)', 'rgb(102, 153, 51, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) b alpha r / g)', 'rgb(153, 1, 51)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r r r / r)', 'rgba(51, 51, 51)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) alpha alpha alpha / alpha)', 'rgba(1, 1, 1, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) calc(255 * alpha) calc(255 * alpha) calc(255 * alpha) / alpha)', 'rgba(204, 204, 204, 0.8)'],

	// Testing mixes of number and percentage. (These would not be allowed in the non-relative syntax).
	['rgb(from rebeccapurple r 20% 10)', 'rgb(102, 51, 10)'],
	['rgb(from rebeccapurple r 10 20%)', 'rgb(102, 10, 51)'],
	['rgb(from rebeccapurple 0% 10 10)', 'rgb(0, 10, 10)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r 20% 10)', 'rgb(51, 51, 10, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) r 10 20%)', 'rgb(51, 10, 51, 0.8)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) 0% 10 10)', 'rgb(0, 10, 10, 0.8)'],

	// r    g    b
	// 102  51   153
	// 40%  20%  60%)
	// Testing with calc().
	['rgb(from rebeccapurple calc(r) calc(g) calc(b))', 'rgb(102, 51, 153)'],
	['rgb(from rebeccapurple r calc(g * 2) 10)', 'rgb(102, 102, 10)'],
	['rgb(from rebeccapurple b calc(r * .5) 10)', 'rgb(153, 51, 10)'],
	['rgb(from rebeccapurple r calc(g * .5 + g * .5) 10)', 'rgb(102, 51, 10)'],
	['rgb(from rebeccapurple r calc(b * .5 - g * .5) 10)', 'rgb(102, 51, 10)'],
	['rgb(from rgb(20%, 40%, 60%, 80%) calc(r) calc(g) calc(b) / calc(alpha))', 'rgba(51, 102, 153, 0.8)'],

	// Testing with 'none'.
	['rgb(from rebeccapurple none none none)', 'rgb(0, 0, 0)'],
	['rgb(from rebeccapurple none none none / none)', 'rgba(0, 0, 0, 0)'],
	['rgb(from rebeccapurple r g none)', 'rgb(102, 51, 0)'],
	['rgb(from rebeccapurple r g none / alpha)', 'rgb(102, 51, 0)'],
	['rgb(from rebeccapurple r g b / none)', 'rgba(102, 51, 153, 0)'],
	['rgb(from rgb(20% 40% 60% / 80%) r g none / alpha)', 'rgba(51, 102, 0, 0.8)'],
	['rgb(from rgb(20% 40% 60% / 80%) r g b / none)', 'rgba(51, 102, 153, 0)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['rgb(from rgb(none none none) r g b)', 'rgb(0, 0, 0)'],
	['rgb(from rgb(none none none / none) r g b / alpha)', 'rgba(0, 0, 0, 0)'],
	['rgb(from rgb(20% none 60%) r g b)', 'rgb(51, 0, 153)'],
	['rgb(from rgb(20% 40% 60% / none) r g b / alpha)', 'rgba(51, 102, 153, 0)'],


	// hsl(from ...)

	// Testing no modifications.
	['hsl(from rebeccapurple h s l)', 'rgb(102, 51, 153)'],
	['hsl(from rebeccapurple h s l / alpha)', 'rgb(102, 51, 153)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h s l / alpha)', 'rgba(51, 102, 153, 0.8)'],
	['hsl(from hsl(120deg 20% 50% / .5) h s l / alpha)', 'rgba(102, 153, 102, 0.5)'],

	// Test nesting relative colors.
	['hsl(from hsl(from rebeccapurple h s l) h s l)', 'rgb(102, 51, 153)'],

	// Testing non-sRGB origin colors to see gamut mapping.
	['hsl(from color(display-p3 0 1 0) h s l / alpha)', 'rgb(0, 247, 79)'], // Naive clip based mapping would give rgb(0, 255, 0).
	['hsl(from lab(100 104.3 -50.9) h s l)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 150, 255).
	['hsl(from lab(0 104.3 -50.9) h s l)', 'rgb(38, 0, 31)'], // Naive clip based mapping would give rgb(90, 0, 76). NOTE: 0% lightness in Lab/LCH does not automatically correspond with sRGB black,
	['hsl(from lch(100 116 334) h s l)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 150, 255).
	['hsl(from lch(0 116 334) h s l)', 'rgb(38, 0, 31)'], // Naive clip based mapping would give rgb(90, 0, 76). NOTE: 0% lightness in Lab/LCH does not automatically correspond with sRGB black,
	['hsl(from oklab(1 0.365 -0.16) h s l)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 92, 255).
	['hsl(from oklab(0 0.365 -0.16) h s l)', 'rgb(0, 0, 0)'], // Naive clip based mapping would give rgb(19, 0, 24).
	['hsl(from oklch(1 0.399 336.3) h s l)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 91, 255).
	['hsl(from oklch(0 0.399 336.3) h s l)', 'rgb(0, 0, 0)'], // Naive clip based mapping would give rgb(20, 0, 24).

	// Testing replacement with 0.
	['hsl(from rebeccapurple 0 0% 0%)', 'rgb(0, 0, 0)'],
	['hsl(from rebeccapurple 0deg 0% 0%)', 'rgb(0, 0, 0)'],
	['hsl(from rebeccapurple 0 0% 0% / 0)', 'rgba(0, 0, 0, 0)'],
	['hsl(from rebeccapurple 0deg 0% 0% / 0)', 'rgba(0, 0, 0, 0)'],
	['hsl(from rebeccapurple 0 s l / alpha)', 'rgb(153, 51, 51)'],
	['hsl(from rebeccapurple 0deg s l / alpha)', 'rgb(153, 51, 51)'],
	['hsl(from rebeccapurple h 0% l / alpha)', 'rgb(102, 102, 102)'],
	['hsl(from rebeccapurple h s 0% / alpha)', 'rgb(0, 0, 0)'],
	['hsl(from rebeccapurple h s l / 0)', 'rgba(102, 51, 153, 0)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) 0 s l / alpha)', 'rgba(153, 51, 51, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) 0deg s l / alpha)', 'rgba(153, 51, 51, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h 0% l / alpha)', 'rgba(102, 102, 102, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h s 0% / alpha)', 'rgba(0, 0, 0, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h s l / 0)', 'rgba(51, 102, 153, 0)'],

	// Testing replacement with a constant.
	['hsl(from rebeccapurple 25 s l / alpha)', 'rgb(153, 94, 51)'],
	['hsl(from rebeccapurple 25deg s l / alpha)', 'rgb(153, 94, 51)'],
	['hsl(from rebeccapurple h 20% l / alpha)', 'rgb(102, 82, 122)'],
	['hsl(from rebeccapurple h s 20% / alpha)', 'rgb(51, 26, 77)'],
	['hsl(from rebeccapurple h s l / .25)', 'rgba(102, 51, 153, 0.25)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) 25 s l / alpha)', 'rgba(153, 94, 51, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) 25deg s l / alpha)', 'rgba(153, 94, 51, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h 20% l / alpha)', 'rgba(82, 102, 122, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h s 20% / alpha)', 'rgba(26, 51, 77, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h s l / .2)', 'rgba(51, 102, 153, 0.2)'],

	// Testing valid permutation (types match).
	['hsl(from rebeccapurple h l s)', 'rgb(128, 77, 179)'],
	['hsl(from rebeccapurple h alpha l / s)', 'rgba(102, 101, 103)'],
	['hsl(from rebeccapurple h l l / l)', 'rgba(102, 61, 143)'],
	['hsl(from rebeccapurple h alpha alpha / alpha)', 'rgb(3, 3, 3)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h l s)', 'rgba(77, 128, 179, 0.8)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h alpha l / s)', 'rgba(101, 102, 103)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h l l / l)', 'rgba(61, 102, 143)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) h alpha alpha / alpha)', 'rgba(2, 2, 2, 0.8)'],

	// Testing with calc().
	['hsl(from rebeccapurple calc(h) calc(s) calc(l))', 'rgb(102, 51, 153)'],
	['hsl(from rgb(20%, 40%, 60%, 80%) calc(h) calc(s) calc(l) / calc(alpha))', 'rgba(51, 102, 153, 0.8)'],

	// Testing with 'none'.
	['hsl(from rebeccapurple none none none)', 'rgb(0, 0, 0)'],
	['hsl(from rebeccapurple none none none / none)', 'rgba(0, 0, 0, 0)'],
	['hsl(from rebeccapurple h s none)', 'rgb(0, 0, 0)'],
	['hsl(from rebeccapurple h s none / alpha)', 'rgb(0, 0, 0)'],
	['hsl(from rebeccapurple h s l / none)', 'rgba(102, 51, 153, 0)'],
	['hsl(from rebeccapurple none s l / alpha)', 'rgb(153, 51, 51)'],
	['hsl(from hsl(120deg 20% 50% / .5) h s none / alpha)', 'rgba(0, 0, 0, 0.5)'],
	['hsl(from hsl(120deg 20% 50% / .5) h s l / none)', 'rgba(102, 153, 102, 0)'],
	['hsl(from hsl(120deg 20% 50% / .5) none s l / alpha)', 'rgba(153, 102, 102, 0.5)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['hsl(from hsl(none none none) h s l)', 'rgb(0, 0, 0)'],
	['hsl(from hsl(none none none / none) h s l / alpha)', 'rgba(0, 0, 0, 0)'],
	['hsl(from hsl(120deg none 50% / .5) h s l)', 'rgb(128, 128, 128, 0.5)'],
	['hsl(from hsl(120deg 20% 50% / none) h s l / alpha)', 'rgba(102, 153, 102, 0)'],
	['hsl(from hsl(none 20% 50% / .5) h s l / alpha)', 'rgba(153, 102, 102, 0.5)'],

	// hwb(from ...)

	// Testing no modifications.
	['hwb(from rebeccapurple h w b)', 'rgb(102, 51, 153)'],
	['hwb(from rebeccapurple h w b / alpha)', 'rgb(102, 51, 153)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h w b / alpha)', 'rgba(51, 102, 153, 0.8)'],
	['hwb(from hsl(120deg 20% 50% / .5) h w b / alpha)', 'rgba(102, 153, 102, 0.5)'],

	// Test nesting relative colors.
	['hwb(from hwb(from rebeccapurple h w b) h w b)', 'rgb(102, 51, 153)'],

	// Testing non-sRGB origin colors to see gamut mapping.
	['hwb(from color(display-p3 0 1 0) h w b / alpha)', 'rgb(0, 247, 79)'], // Naive clip based mapping would give rgb(0, 255, 0).
	['hwb(from lab(100 104.3 -50.9) h w b)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 150, 255).
	['hwb(from lab(0 104.3 -50.9) h w b)', 'rgb(38, 0, 31)'], // Naive clip based mapping would give rgb(90, 0, 76). NOTE: 0% lightness in Lab/LCH does not automatically correspond with sRGB black,
	['hwb(from lch(100 116 334) h w b)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 150, 255).
	['hwb(from lch(0 116 334) h w b)', 'rgb(38, 0, 31)'], // Naive clip based mapping would give rgb(90, 0, 76). NOTE: 0% lightness in Lab/LCH does not automatically correspond with sRGB black,
	['hwb(from oklab(1 0.365 -0.16) h w b)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 92, 255).
	['hwb(from oklab(0 0.365 -0.16) h w b)', 'rgb(0, 0, 0)'], // Naive clip based mapping would give rgb(19, 0, 24).
	['hwb(from oklch(1 0.399 336.3) h w b)', 'rgb(255, 255, 255)'], // Naive clip based mapping would give rgb(255, 91, 255).
	['hwb(from oklch(0 0.399 336.3) h w b)', 'rgb(0, 0, 0)'], // Naive clip based mapping would give rgb(20, 0, 24).

	// Testing replacement with 0.
	['hwb(from rebeccapurple 0 0% 0%)', 'rgb(255, 0, 0)'],
	['hwb(from rebeccapurple 0deg 0% 0%)', 'rgb(255, 0, 0)'],
	['hwb(from rebeccapurple 0 0% 0% / 0)', 'rgba(255, 0, 0, 0)'],
	['hwb(from rebeccapurple 0deg 0% 0% / 0)', 'rgba(255, 0, 0, 0)'],
	['hwb(from rebeccapurple 0 w b / alpha)', 'rgb(153, 51, 51)'],
	['hwb(from rebeccapurple 0deg w b / alpha)', 'rgb(153, 51, 51)'],
	['hwb(from rebeccapurple h 0% b / alpha)', 'rgb(77, 0, 153)'],
	['hwb(from rebeccapurple h w 0% / alpha)', 'rgb(153, 51, 255)'],
	['hwb(from rebeccapurple h w b / 0)', 'rgba(102, 51, 153, 0)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) 0 w b / alpha)', 'rgba(153, 51, 51, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) 0deg w b / alpha)', 'rgba(153, 51, 51, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h 0% b / alpha)', 'rgba(0, 77, 153, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h w 0% / alpha)', 'rgba(51, 153, 255, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h w b / 0)', 'rgba(51, 102, 153, 0)'],

	// Testing replacement with a constant.
	['hwb(from rebeccapurple 25 w b / alpha)', 'rgb(153, 94, 51)'],
	['hwb(from rebeccapurple 25deg w b / alpha)', 'rgb(153, 94, 51)'],
	['hwb(from rebeccapurple h 20% b / alpha)', 'rgb(102, 51, 153)'],
	['hwb(from rebeccapurple h w 20% / alpha)', 'rgb(128, 51, 204)'],
	['hwb(from rebeccapurple h w b / .2)', 'rgba(102, 51, 153, 0.2)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) 25 w b / alpha)', 'rgba(153, 94, 51, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) 25deg w b / alpha)', 'rgba(153, 94, 51, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h 20% b / alpha)', 'rgba(51, 102, 153, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h w 20% / alpha)', 'rgba(51, 128, 204, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h w b / .2)', 'rgba(51, 102, 153, 0.2)'],

	// Testing valid permutation (types match).
	['hwb(from rebeccapurple h b w)', 'rgb(153, 102, 204)'],
	['hwb(from rebeccapurple h calc(100% * alpha) w / b)', 'rgba(212, 212, 212)'],
	['hwb(from rebeccapurple h w w / w)', 'rgba(128, 51, 204)'],
	['hwb(from rebeccapurple h calc(100% * alpha) calc(100% * alpha) / alpha)', 'rgb(128, 128, 128)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h b w)', 'rgba(102, 153, 204, 0.8)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h calc(100% * alpha) w / b)', 'rgba(204, 204, 204)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h w w / w)', 'rgba(51, 128, 204)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) h calc(100% * alpha) calc(100% * alpha) / alpha)', 'rgba(128, 128, 128, 0.8)'],

	// Testing with calc().
	['hwb(from rebeccapurple calc(h) calc(w) calc(b))', 'rgb(102, 51, 153)'],
	['hwb(from rgb(20%, 40%, 60%, 80%) calc(h) calc(w) calc(b) / calc(alpha))', 'rgba(51, 102, 153, 0.8)'],

	// Testing with 'none'.
	['hwb(from rebeccapurple none none none)', 'rgb(255, 0, 0)'],
	['hwb(from rebeccapurple none none none / none)', 'rgba(255, 0, 0, 0)'],
	['hwb(from rebeccapurple h w none)', 'rgb(153, 51, 255)'],
	['hwb(from rebeccapurple h w none / alpha)', 'rgb(153, 51, 255)'],
	['hwb(from rebeccapurple h w b / none)', 'rgba(102, 51, 153, 0)'],
	['hwb(from rebeccapurple none w b / alpha)', 'rgb(153, 51, 51)'],
	['hwb(from hwb(120deg 20% 50% / .5) h w none / alpha)', 'rgba(51, 255, 51, 0.5)'],
	['hwb(from hwb(120deg 20% 50% / .5) h w b / none)', 'rgba(51, 128, 51, 0)'],
	['hwb(from hwb(120deg 20% 50% / .5) none w b / alpha)', 'rgba(128, 51, 51, 0.5)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['hwb(from hwb(none none none) h w b)', 'rgb(255, 0, 0)'],
	['hwb(from hwb(none none none / none) h w b / alpha)', 'rgba(255, 0, 0, 0)'],
	['hwb(from hwb(120deg none 50% / .5) h w b)', 'rgba(0, 128, 0, 0.5)'],
	['hwb(from hwb(120deg 20% 50% / none) h w b / alpha)', 'rgba(51, 128, 51, 0)'],
	['hwb(from hwb(none 20% 50% / .5) h w b / alpha)', 'rgba(128, 51, 51, 0.5)'],

	// lab()

	// Testing no modifications.
	['lab(from lab(25 20 50) l a b)', 'lab(25 20 50)'],
	['lab(from lab(25 20 50) l a b / alpha)', 'lab(25 20 50)'],
	['lab(from lab(25 20 50 / 40%) l a b / alpha)', 'lab(25 20 50 / 0.4)'],
	['lab(from lab(200 300 400 / 500%) l a b / alpha)', 'lab(200 300 400)'],
	['lab(from lab(-200 -300 -400 / -500%) l a b / alpha)', 'lab(0 -300 -400 / 0)'],

	// Test nesting relative colors.
	['lab(from lab(from lab(25 20 50) l a b) l a b)', 'lab(25 20 50)'],

	// Testing non-lab origin to see conversion.
	['lab(from color(display-p3 0 0 0) l a b / alpha)', 'lab(0 0 0)'],

	// Testing replacement with 0.
	['lab(from lab(25 20 50) 0 0 0)', 'lab(0 0 0)'],
	['lab(from lab(25 20 50) 0 0 0 / 0)', 'lab(0 0 0 / 0)'],
	['lab(from lab(25 20 50) 0 a b / alpha)', 'lab(0 20 50)'],
	['lab(from lab(25 20 50) l 0 b / alpha)', 'lab(25 0 50)'],
	['lab(from lab(25 20 50) l a 0 / alpha)', 'lab(25 20 0)'],
	['lab(from lab(25 20 50) l a b / 0)', 'lab(25 20 50 / 0)'],
	['lab(from lab(25 20 50 / 40%) 0 a b / alpha)', 'lab(0 20 50 / 0.4)'],
	['lab(from lab(25 20 50 / 40%) l 0 b / alpha)', 'lab(25 0 50 / 0.4)'],
	['lab(from lab(25 20 50 / 40%) l a 0 / alpha)', 'lab(25 20 0 / 0.4)'],
	['lab(from lab(25 20 50 / 40%) l a b / 0)', 'lab(25 20 50 / 0)'],

	// Testing replacement with a constant.
	['lab(from lab(25 20 50) 35 a b / alpha)', 'lab(35 20 50)'],
	['lab(from lab(25 20 50) l 35 b / alpha)', 'lab(25 35 50)'],
	['lab(from lab(25 20 50) l a 35 / alpha)', 'lab(25 20 35)'],
	['lab(from lab(25 20 50) l a b / .35)', 'lab(25 20 50 / 0.35)'],
	['lab(from lab(25 20 50 / 40%) 35 a b / alpha)', 'lab(35 20 50 / 0.4)'],
	['lab(from lab(25 20 50 / 40%) l 35 b / alpha)', 'lab(25 35 50 / 0.4)'],
	['lab(from lab(25 20 50 / 40%) l a 35 / alpha)', 'lab(25 20 35 / 0.4)'],
	['lab(from lab(25 20 50 / 40%) l a b / .35)', 'lab(25 20 50 / 0.35)'],
	['lab(from lab(0.7 45 30 / 40%) 200 300 400 / 500)', 'lab(200 300 400)'],
	['lab(from lab(0.7 45 30 / 40%) -200 -300 -400 / -500)', 'lab(0 -300 -400 / 0)'],

	// Testing valid permutation (types match).
	['lab(from lab(25 20 50) l b a)', 'lab(25 50 20)'],
	['lab(from lab(25 20 50) l a a / a)', 'lab(25 20 20)'],
	['lab(from lab(25 20 50 / 40%) l b a)', 'lab(25 50 20 / 0.4)'],
	['lab(from lab(25 20 50 / 40%) l a a / a)', 'lab(25 20 20)'],

	// Testing with calc().
	['lab(from lab(25 20 50) calc(l) calc(a) calc(b))', 'lab(25 20 50)'],
	['lab(from lab(25 20 50 / 40%) calc(l) calc(a) calc(b) / calc(alpha))', 'lab(25 20 50 / 0.4)'],

	// Testing with 'none'.
	['lab(from lab(25 20 50) none none none)', 'lab(none none none)'],
	['lab(from lab(25 20 50) none none none / none)', 'lab(none none none / none)'],
	['lab(from lab(25 20 50) l a none)', 'lab(25 20 none)'],
	['lab(from lab(25 20 50) l a none / alpha)', 'lab(25 20 none)'],
	['lab(from lab(25 20 50) l a b / none)', 'lab(25 20 50 / none)'],
	['lab(from lab(25 20 50 / 40%) l a none / alpha)', 'lab(25 20 none / 0.4)'],
	['lab(from lab(25 20 50 / 40%) l a b / none)', 'lab(25 20 50 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['lab(from lab(none none none) l a b)', 'lab(0 0 0)'],
	['lab(from lab(none none none / none) l a b / alpha)', 'lab(0 0 0 / 0)'],
	['lab(from lab(25 none 50) l a b)', 'lab(25 0 50)'],
	['lab(from lab(25 20 50 / none) l a b / alpha)', 'lab(25 20 50 / 0)'],

	// oklab()

	// Testing no modifications.
	['oklab(from oklab(0.25 0.2 0.5) l a b)', 'oklab(0.25 0.2 0.5)'],
	['oklab(from oklab(0.25 0.2 0.5) l a b / alpha)', 'oklab(0.25 0.2 0.5)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l a b / alpha)', 'oklab(0.25 0.2 0.5 / 0.4)'],
	['oklab(from oklab(2 3 4 / 500%) l a b / alpha)', 'oklab(1 3 4)'],
	['oklab(from oklab(-2 -3 -4 / -500%) l a b / alpha)', 'oklab(0 -3 -4 / 0)'],

	// Test nesting relative colors.
	['oklab(from oklab(from oklab(0.25 0.2 0.5) l a b) l a b)', 'oklab(0.25 0.2 0.5)'],

	// Testing non-oklab origin to see conversion.
	['oklab(from color(display-p3 0 0 0) l a b / alpha)', 'oklab(0 0 0)'],

	// Testing replacement with 0.
	['oklab(from oklab(0.25 0.2 0.5) 0 0 0)', 'oklab(0 0 0)'],
	['oklab(from oklab(0.25 0.2 0.5) 0 0 0 / 0)', 'oklab(0 0 0 / 0)'],
	['oklab(from oklab(0.25 0.2 0.5) 0 a b / alpha)', 'oklab(0 0.2 0.5)'],
	['oklab(from oklab(0.25 0.2 0.5) l 0 b / alpha)', 'oklab(0.25 0 0.5)'],
	['oklab(from oklab(0.25 0.2 0.5) l a 0 / alpha)', 'oklab(0.25 0.2 0)'],
	['oklab(from oklab(0.25 0.2 0.5) l a b / 0)', 'oklab(0.25 0.2 0.5 / 0)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) 0 a b / alpha)', 'oklab(0 0.2 0.5 / 0.4)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l 0 b / alpha)', 'oklab(0.25 0 0.5 / 0.4)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l a 0 / alpha)', 'oklab(0.25 0.2 0 / 0.4)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l a b / 0)', 'oklab(0.25 0.2 0.5 / 0)'],

	// Testing replacement with a constant.
	['oklab(from oklab(0.25 0.2 0.5) 0.35 a b / alpha)', 'oklab(0.35 0.2 0.5)'],
	['oklab(from oklab(0.25 0.2 0.5) l 0.35 b / alpha)', 'oklab(0.25 0.35 0.5)'],
	['oklab(from oklab(0.25 0.2 0.5) l a 0.35 / alpha)', 'oklab(0.25 0.2 0.35)'],
	['oklab(from oklab(0.25 0.2 0.5) l a b / .35)', 'oklab(0.25 0.2 0.5 / 0.35)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) 0.35 a b / alpha)', 'oklab(0.35 0.2 0.5 / 0.4)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l 0.35 b / alpha)', 'oklab(0.25 0.35 0.5 / 0.4)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l a 0.35 / alpha)', 'oklab(0.25 0.2 0.35 / 0.4)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l a b / .35)', 'oklab(0.25 0.2 0.5 / 0.35)'],
	['oklab(from oklab(0.7 0.45 0.3 / 40%) 2 3 4 / 500)', 'oklab(1 3 4)'],
	['oklab(from oklab(0.7 0.45 0.3 / 40%) -2 -3 -4 / -500)', 'oklab(0 -3 -4 / 0)'],

	// Testing valid permutation (types match).
	['oklab(from oklab(0.25 0.2 0.5) l b a)', 'oklab(0.25 0.5 0.2)'],
	['oklab(from oklab(0.25 0.2 0.5) l a a / a)', 'oklab(0.25 0.2 0.2 / 0.2)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l b a)', 'oklab(0.25 0.5 0.2 / 0.4)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l a a / a)', 'oklab(0.25 0.2 0.2 / 0.2)'],

	// Testing with calc().
	['oklab(from oklab(0.25 0.2 0.5) calc(l) calc(a) calc(b))', 'oklab(0.25 0.2 0.5)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) calc(l) calc(a) calc(b) / calc(alpha))', 'oklab(0.25 0.2 0.5 / 0.4)'],

	// Testing with 'none'.
	['oklab(from oklab(0.25 0.2 0.5) none none none)', 'oklab(none none none)'],
	['oklab(from oklab(0.25 0.2 0.5) none none none / none)', 'oklab(none none none / none)'],
	['oklab(from oklab(0.25 0.2 0.5) l a none)', 'oklab(0.25 0.2 none)'],
	['oklab(from oklab(0.25 0.2 0.5) l a none / alpha)', 'oklab(0.25 0.2 none)'],
	['oklab(from oklab(0.25 0.2 0.5) l a b / none)', 'oklab(0.25 0.2 0.5 / none)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l a none / alpha)', 'oklab(0.25 0.2 none / 0.4)'],
	['oklab(from oklab(0.25 0.2 0.5 / 40%) l a b / none)', 'oklab(0.25 0.2 0.5 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['oklab(from oklab(none none none) l a b)', 'oklab(0 0 0)'],
	['oklab(from oklab(none none none / none) l a b / alpha)', 'oklab(0 0 0 / 0)'],
	['oklab(from oklab(0.25 none 0.5) l a b)', 'oklab(0.25 0 0.5)'],
	['oklab(from oklab(0.25 0.2 0.5 / none) l a b / alpha)', 'oklab(0.25 0.2 0.5 / 0)'],

	// lab and oklab tests that require different results due to percent scaling differences.
	['lab(from lab(.7 45 30) calc(100 * alpha) b a / l)', 'lab(100 30 45 / 0.7)'],
	['lab(from lab(.7 45 30) calc(100 * alpha) a b / alpha)', 'lab(100 45 30)'],
	['lab(from lab(.7 45 30) calc(100 * alpha) a a / alpha)', 'lab(100 45 45)'],
	['lab(from lab(.7 45 30 / 40%) calc(100 * alpha) b a / l)', 'lab(40 30 45 / 0.7)'],
	['lab(from lab(.7 45 30 / 40%) calc(100 * alpha) a b / alpha)', 'lab(40 45 30 / 0.4)'],
	['lab(from lab(.7 45 30 / 40%) calc(100 * alpha) a a / alpha)', 'lab(40 45 45 / 0.4)'],

	['oklab(from oklab(.7 0.45 0.3) alpha b a / l)', 'oklab(1 0.3 0.45 / 0.7)'],
	['oklab(from oklab(.7 0.45 0.3) alpha a b / alpha)', 'oklab(1 0.45 0.3)'],
	['oklab(from oklab(.7 0.45 0.3) alpha a a / alpha)', 'oklab(1 0.45 0.45)'],
	['oklab(from oklab(.7 0.45 0.3 / 40%) alpha b a / l)', 'oklab(0.4 0.3 0.45 / 0.7)'],
	['oklab(from oklab(.7 0.45 0.3 / 40%) alpha a b / alpha)', 'oklab(0.4 0.45 0.3 / 0.4)'],
	['oklab(from oklab(.7 0.45 0.3 / 40%) alpha a a / alpha)', 'oklab(0.4 0.45 0.45 / 0.4)'],

	// lch()

	// Testing no modifications.
	['lch(from lch(0.7 45 30) l c h)', 'lch(0.7 45 30)'],
	['lch(from lch(0.7 45 30) l c h / alpha)', 'lch(0.7 45 30)'],
	['lch(from lch(0.7 45 30 / 40%) l c h / alpha)', 'lch(0.7 45 30 / 0.4)'],
	['lch(from lch(200 300 400 / 500%) l c h / alpha)', 'lch(200 300 40)'],
	['lch(from lch(-200 -300 -400 / -500%) l c h / alpha)', 'lch(0 0 320 / 0)'],

	// Test nesting relative colors.
	['lch(from lch(from lch(0.7 45 30) l c h) l c h)', 'lch(0.7 45 30)'],

	// Testing non-sRGB origin colors (no gamut mapping will happen since the destination is not a bounded RGB color space).
	['lch(from color(display-p3 0 0 0) l c h / alpha)', 'lch(0 0 0)'],
	['lch(from lab(0.7 45 30) l c h / alpha)', 'lch(0.7 54.08327 33.690067)'],

	// Testing replacement with 0.
	['lch(from lch(0.7 45 30) 0 0 0)', 'lch(0 0 0)'],
	['lch(from lch(0.7 45 30) 0 0 0deg)', 'lch(0 0 0)'],
	['lch(from lch(0.7 45 30) 0 0 0 / 0)', 'lch(0 0 0 / 0)'],
	['lch(from lch(0.7 45 30) 0 0 0deg / 0)', 'lch(0 0 0 / 0)'],
	['lch(from lch(0.7 45 30) 0 c h / alpha)', 'lch(0 45 30)'],
	['lch(from lch(0.7 45 30) l 0 h / alpha)', 'lch(0.7 0 30)'],
	['lch(from lch(0.7 45 30) l c 0 / alpha)', 'lch(0.7 45 0)'],
	['lch(from lch(0.7 45 30) l c 0deg / alpha)', 'lch(0.7 45 0)'],
	['lch(from lch(0.7 45 30) l c h / 0)', 'lch(0.7 45 30 / 0)'],
	['lch(from lch(0.7 45 30 / 40%) 0 c h / alpha)', 'lch(0 45 30 / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l 0 h / alpha)', 'lch(0.7 0 30 / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l c 0 / alpha)', 'lch(0.7 45 0 / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l c 0deg / alpha)', 'lch(0.7 45 0 / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l c h / 0)', 'lch(0.7 45 30 / 0)'],

	// Testing replacement with a constant.
	['lch(from lch(0.7 45 30) 25 c h / alpha)', 'lch(25 45 30)'],
	['lch(from lch(0.7 45 30) l 25 h / alpha)', 'lch(0.7 25 30)'],
	['lch(from lch(0.7 45 30) l c 25 / alpha)', 'lch(0.7 45 25)'],
	['lch(from lch(0.7 45 30) l c 25deg / alpha)', 'lch(0.7 45 25)'],
	['lch(from lch(0.7 45 30) l c h / .25)', 'lch(0.7 45 30 / 0.25)'],
	['lch(from lch(0.7 45 30 / 40%) 25 c h / alpha)', 'lch(25 45 30 / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l 25 h / alpha)', 'lch(0.7 25 30 / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l c 25 / alpha)', 'lch(0.7 45 25 / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l c 25deg / alpha)', 'lch(0.7 45 25 / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l c h / .25)', 'lch(0.7 45 30 / 0.25)'],
	['lch(from lch(0.7 45 30 / 40%) 200 300 400 / 500)', 'lch(200 300 40)'],
	['lch(from lch(0.7 45 30 / 40%) -200 -300 -400 / -500)', 'lch(0 0 320 / 0)'],
	['lch(from lch(0.7 45 30 / 40%) 50 120 400deg / 500)', 'lch(50 120 40)'],
	['lch(from lch(0.7 45 30 / 40%) 50 120 -400deg / -500)', 'lch(50 120 320 / 0)'],

	// Testing valid permutation (types match).
	// NOTE: 'c' is a vaild hue, as hue is <angle>|<number>.
	['lch(from lch(.7 45 30) l c c / alpha)', 'lch(0.7 45 45)'],
	['lch(from lch(.7 45 30 / 40%) l c c / alpha)', 'lch(0.7 45 45 / 0.4)'],

	// Testing with calc().
	['lch(from lch(0.7 45 30) calc(l) calc(c) calc(h))', 'lch(0.7 45 30)'],
	['lch(from lch(0.7 45 30 / 40%) calc(l) calc(c) calc(h) / calc(alpha))', 'lch(0.7 45 30 / 0.4)'],

	// Testing with 'none'.
	['lch(from lch(0.7 45 30) none none none)', 'lch(none none none)'],
	['lch(from lch(0.7 45 30) none none none / none)', 'lch(none none none / none)'],
	['lch(from lch(0.7 45 30) l c none)', 'lch(0.7 45 none)'],
	['lch(from lch(0.7 45 30) l c none / alpha)', 'lch(0.7 45 none)'],
	['lch(from lch(0.7 45 30) l c h / none)', 'lch(0.7 45 30 / none)'],
	['lch(from lch(0.7 45 30 / 40%) l c none / alpha)', 'lch(0.7 45 none / 0.4)'],
	['lch(from lch(0.7 45 30 / 40%) l c h / none)', 'lch(0.7 45 30 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['lch(from lch(none none none) l c h)', 'lch(0 0 0)'],
	['lch(from lch(none none none / none) l c h / alpha)', 'lch(0 0 0 / 0)'],
	['lch(from lch(0.7 none 30) l c h)', 'lch(0.7 0 30)'],
	['lch(from lch(0.7 45 30 / none) l c h / alpha)', 'lch(0.7 45 30 / 0)'],

	// oklch()

	// Testing no modifications.
	['oklch(from oklch(0.7 0.45 30) l c h)', 'oklch(0.7 0.45 30)'],
	['oklch(from oklch(0.7 0.45 30) l c h / alpha)', 'oklch(0.7 0.45 30)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c h / alpha)', 'oklch(0.7 0.45 30 / 0.4)'],
	['oklch(from oklch(2 3 400 / 500%) l c h / alpha)', 'oklch(1 3 40)'],
	['oklch(from oklch(-2 -3 -400 / -500%) l c h / alpha)', 'oklch(0 0 320 / 0)'],

	// Test nesting relative colors.
	['oklch(from oklch(from oklch(0.7 0.45 30) l c h) l c h)', 'oklch(0.7 0.45 30)'],

	// Testing non-sRGB origin colors (no gamut mapping will happen since the destination is not a bounded RGB color space).
	['oklch(from color(display-p3 0 0 0) l c h / alpha)', 'oklch(0 0 0)'],
	// TODO: redo conversion with oklab(0.7 0.45 0.3)
	['oklch(from oklab(0.7 45 30) l c h / alpha)', 'oklch(0.7 54.08327 33.690067)'],

	// Testing replacement with 0.
	['oklch(from oklch(0.7 0.45 30) 0 0 0)', 'oklch(0 0 0)'],
	['oklch(from oklch(0.7 0.45 30) 0 0 0deg)', 'oklch(0 0 0)'],
	['oklch(from oklch(0.7 0.45 30) 0 0 0 / 0)', 'oklch(0 0 0 / 0)'],
	['oklch(from oklch(0.7 0.45 30) 0 0 0deg / 0)', 'oklch(0 0 0 / 0)'],
	['oklch(from oklch(0.7 0.45 30) 0 c h / alpha)', 'oklch(0 0.45 30)'],
	['oklch(from oklch(0.7 0.45 30) l 0 h / alpha)', 'oklch(0.7 0 30)'],
	['oklch(from oklch(0.7 0.45 30) l c 0 / alpha)', 'oklch(0.7 0.45 0)'],
	['oklch(from oklch(0.7 0.45 30) l c 0deg / alpha)', 'oklch(0.7 0.45 0)'],
	['oklch(from oklch(0.7 0.45 30) l c h / 0)', 'oklch(0.7 0.45 30 / 0)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) 0 c h / alpha)', 'oklch(0 0.45 30 / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l 0 h / alpha)', 'oklch(0.7 0 30 / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c 0 / alpha)', 'oklch(0.7 0.45 0 / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c 0deg / alpha)', 'oklch(0.7 0.45 0 / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c h / 0)', 'oklch(0.7 0.45 30 / 0)'],

	// Testing replacement with a constant.
	['oklch(from oklch(0.7 0.45 30) 0.25 c h / alpha)', 'oklch(0.25 0.45 30)'],
	['oklch(from oklch(0.7 0.45 30) l 0.25 h / alpha)', 'oklch(0.7 0.25 30)'],
	['oklch(from oklch(0.7 0.45 30) l c 25 / alpha)', 'oklch(0.7 0.45 25)'],
	['oklch(from oklch(0.7 0.45 30) l c 25deg / alpha)', 'oklch(0.7 0.45 25)'],
	['oklch(from oklch(0.7 0.45 30) l c h / .25)', 'oklch(0.7 0.45 30 / 0.25)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) 0.25 c h / alpha)', 'oklch(0.25 0.45 30 / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l 0.25 h / alpha)', 'oklch(0.7 0.25 30 / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c 25 / alpha)', 'oklch(0.7 0.45 25 / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c 25deg / alpha)', 'oklch(0.7 0.45 25 / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c h / .25)', 'oklch(0.7 0.45 30 / 0.25)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) 2 3 400 / 500)', 'oklch(1 3 40)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) -2 -3 -400 / -500)', 'oklch(0 0 320 / 0)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) 0.5 1.2 400deg / 500)', 'oklch(0.5 1.2 40)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) 0.5 1.2 -400deg / -500)', 'oklch(0.5 1.2 320 / 0)'],

	// Testing valid permutation (types match).
	// NOTE: 'c' is a vaild hue, as hue is <angle>|<number>.
	['oklch(from oklch(.7 0.45 30) l c c / alpha)', 'oklch(0.7 0.45 0.45)'],
	['oklch(from oklch(.7 0.45 30 / 40%) l c c / alpha)', 'oklch(0.7 0.45 0.45 / 0.4)'],

	// Testing with calc().
	['oklch(from oklch(0.7 0.45 30) calc(l) calc(c) calc(h))', 'oklch(0.7 0.45 30)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) calc(l) calc(c) calc(h) / calc(alpha))', 'oklch(0.7 0.45 30 / 0.4)'],

	// Testing with 'none'.
	['oklch(from oklch(0.7 0.45 30) none none none)', 'oklch(none none none)'],
	['oklch(from oklch(0.7 0.45 30) none none none / none)', 'oklch(none none none / none)'],
	['oklch(from oklch(0.7 0.45 30) l c none)', 'oklch(0.7 0.45 none)'],
	['oklch(from oklch(0.7 0.45 30) l c none / alpha)', 'oklch(0.7 0.45 none)'],
	['oklch(from oklch(0.7 0.45 30) l c h / none)', 'oklch(0.7 0.45 30 / none)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c none / alpha)', 'oklch(0.7 0.45 none / 0.4)'],
	['oklch(from oklch(0.7 0.45 30 / 40%) l c h / none)', 'oklch(0.7 0.45 30 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['oklch(from oklch(none none none) l c h)', 'oklch(0 0 0)'],
	['oklch(from oklch(none none none / none) l c h / alpha)', 'oklch(0 0 0 / 0)'],
	['oklch(from oklch(0.7 none 30) l c h)', 'oklch(0.7 0 30)'],
	['oklch(from oklch(0.7 0.45 30 / none) l c h / alpha)', 'oklch(0.7 0.45 30 / 0)'],

	// lch and oklch tests that require different results due to percent scaling differences.
	['lch(from lch(.7 45 30) calc(100 * alpha) c h / l)', 'lch(100 45 30 / 0.7)'],
	['lch(from lch(.7 45 30) calc(100 * alpha) c h / alpha)', 'lch(100 45 30)'],
	['lch(from lch(.7 45 30) calc(100 * alpha) c c / alpha)', 'lch(100 45 45)'],
	['lch(from lch(.7 45 30 / 40%) calc(100 * alpha) c h / l)', 'lch(40 45 30 / 0.7)'],
	['lch(from lch(.7 45 30 / 40%) calc(100 * alpha) c h / alpha)', 'lch(40 45 30 / 0.4)'],
	['lch(from lch(.7 45 30 / 40%) calc(100 * alpha) c c / alpha)', 'lch(40 45 45 / 0.4)'],

	['oklch(from oklch(.7 0.45 30) alpha c h / l)', 'oklch(1 0.45 30 / 0.7)'],
	['oklch(from oklch(.7 0.45 30) alpha c h / alpha)', 'oklch(1 0.45 30)'],
	['oklch(from oklch(.7 0.45 30) alpha c c / alpha)', 'oklch(1 0.45 0.45)'],
	['oklch(from oklch(.7 0.45 30 / 40%) alpha c h / l)', 'oklch(0.4 0.45 30 / 0.7)'],
	['oklch(from oklch(.7 0.45 30 / 40%) alpha c h / alpha)', 'oklch(0.4 0.45 30 / 0.4)'],
	['oklch(from oklch(.7 0.45 30 / 40%) alpha c c / alpha)', 'oklch(0.4 0.45 0.45 / 0.4)'],

	['color(from color(srgb 0.7 0.5 0.3) srgb r g b)', 'color(srgb 0.7 0.5 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g b / alpha)', 'color(srgb 0.7 0.5 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g b)', 'color(srgb 0.7 0.5 0.3 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g b / alpha)', 'color(srgb 0.7 0.5 0.3 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(srgb 0.7 0.5 0.3) srgb r g b) srgb r g b)', 'color(srgb 0.7 0.5 0.3)'],

	// Testing replacement with 0.
	['color(from color(srgb 0.7 0.5 0.3) srgb 0 0 0)', 'color(srgb 0 0 0)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb 0 0 0 / 0)', 'color(srgb 0 0 0 / 0)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb 0 g b / alpha)', 'color(srgb 0 0.5 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r 0 b / alpha)', 'color(srgb 0.7 0 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g 0 / alpha)', 'color(srgb 0.7 0.5 0)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g b / 0)', 'color(srgb 0.7 0.5 0.3 / 0)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb 0 g b / alpha)', 'color(srgb 0 0.5 0.3 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r 0 b / alpha)', 'color(srgb 0.7 0 0.3 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g 0 / alpha)', 'color(srgb 0.7 0.5 0 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g b / 0)', 'color(srgb 0.7 0.5 0.3 / 0)'],

	// Testing replacement with a constant.
	['color(from color(srgb 0.7 0.5 0.3) srgb 0.2 g b / alpha)', 'color(srgb 0.2 0.5 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb 20% g b / alpha)', 'color(srgb 0.2 0.5 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r 0.2 b / alpha)', 'color(srgb 0.7 0.2 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r 20% b / alpha)', 'color(srgb 0.7 0.2 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g 0.2 / alpha)', 'color(srgb 0.7 0.5 0.2)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g 20% / alpha)', 'color(srgb 0.7 0.5 0.2)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g b / 0.2)', 'color(srgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g b / 20%)', 'color(srgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb 0.2 g b / alpha)', 'color(srgb 0.2 0.5 0.3 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb 20% g b / alpha)', 'color(srgb 0.2 0.5 0.3 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r 0.2 b / alpha)', 'color(srgb 0.7 0.2 0.3 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r 20% b / alpha)', 'color(srgb 0.7 0.2 0.3 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g 0.2 / alpha)', 'color(srgb 0.7 0.5 0.2 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g 20% / alpha)', 'color(srgb 0.7 0.5 0.2 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g b / 0.2)', 'color(srgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g b / 20%)', 'color(srgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb 2 3 4)', 'color(srgb 2 3 4)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb 2 3 4 / 5)', 'color(srgb 2 3 4)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb -2 -3 -4)', 'color(srgb -2 -3 -4)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb -2 -3 -4 / -5)', 'color(srgb -2 -3 -4 / 0)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb 200% 300% 400%)', 'color(srgb 2 3 4)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb 200% 300% 400% / 500%)', 'color(srgb 2 3 4)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb -200% -300% -400%)', 'color(srgb -2 -3 -4)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb -200% -300% -400% / -500%)', 'color(srgb -2 -3 -4 / 0)'],

	// Testing valid permutation (types match).
	['color(from color(srgb 0.7 0.5 0.3) srgb g b r)', 'color(srgb 0.5 0.3 0.7)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb b alpha r / g)', 'color(srgb 0.3 1 0.7 / 0.5)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r r r / r)', 'color(srgb 0.7 0.7 0.7 / 0.7)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb alpha alpha alpha / alpha)', 'color(srgb 1 1 1)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb g b r)', 'color(srgb 0.5 0.3 0.7 / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb b alpha r / g)', 'color(srgb 0.3 0.4 0.7 / 0.5)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r r r / r)', 'color(srgb 0.7 0.7 0.7 / 0.7)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb alpha alpha alpha / alpha)', 'color(srgb 0.4 0.4 0.4 / 0.4)'],

	// Testing out of gamut components.
	['color(from color(srgb 1.7 1.5 1.3) srgb r g b)', 'color(srgb 1.7 1.5 1.3)'],
	['color(from color(srgb 1.7 1.5 1.3) srgb r g b / alpha)', 'color(srgb 1.7 1.5 1.3)'],
	['color(from color(srgb 1.7 1.5 1.3 / 140%) srgb r g b)', 'color(srgb 1.7 1.5 1.3)'],
	['color(from color(srgb 1.7 1.5 1.3 / 140%) srgb r g b / alpha)', 'color(srgb 1.7 1.5 1.3)'],
	['color(from color(srgb -0.7 -0.5 -0.3) srgb r g b)', 'color(srgb -0.7 -0.5 -0.3)'],
	['color(from color(srgb -0.7 -0.5 -0.3) srgb r g b / alpha)', 'color(srgb -0.7 -0.5 -0.3)'],
	['color(from color(srgb -0.7 -0.5 -0.3 / -40%) srgb r g b)', 'color(srgb -0.7 -0.5 -0.3 / 0)'],
	['color(from color(srgb -0.7 -0.5 -0.3 / -40%) srgb r g b / alpha)', 'color(srgb -0.7 -0.5 -0.3 / 0)'],

	// Testing with calc().
	['color(from color(srgb 0.7 0.5 0.3) srgb calc(r) calc(g) calc(b))', 'color(srgb 0.7 0.5 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb calc(r) calc(g) calc(b) / calc(alpha))', 'color(srgb 0.7 0.5 0.3 / 0.4)'],

	// Testing with 'none'.
	['color(from color(srgb 0.7 0.5 0.3) srgb none none none)', 'color(srgb none none none)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb none none none / none)', 'color(srgb none none none / none)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g none)', 'color(srgb 0.7 0.5 none)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g none / alpha)', 'color(srgb 0.7 0.5 none)'],
	['color(from color(srgb 0.7 0.5 0.3) srgb r g b / none)', 'color(srgb 0.7 0.5 0.3 / none)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g none / alpha)', 'color(srgb 0.7 0.5 none / 0.4)'],
	['color(from color(srgb 0.7 0.5 0.3 / 40%) srgb r g b / none)', 'color(srgb 0.7 0.5 0.3 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(srgb none none none) srgb r g b)', 'color(srgb 0 0 0)'],
	['color(from color(srgb none none none / none) srgb r g b / alpha)', 'color(srgb 0 0 0 / 0)'],
	['color(from color(srgb 0.7 none 0.3) srgb r g b)', 'color(srgb 0.7 0 0.3)'],
	['color(from color(srgb 0.7 0.5 0.3 / none) srgb r g b / alpha)', 'color(srgb 0.7 0.5 0.3 / 0)'],

	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b)', 'color(srgb-linear 0.7 0.5 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b / alpha)', 'color(srgb-linear 0.7 0.5 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g b)', 'color(srgb-linear 0.7 0.5 0.3 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g b / alpha)', 'color(srgb-linear 0.7 0.5 0.3 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b) srgb-linear r g b)', 'color(srgb-linear 0.7 0.5 0.3)'],

	// Testing replacement with 0.
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 0 0 0)', 'color(srgb-linear 0 0 0)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 0 0 0 / 0)', 'color(srgb-linear 0 0 0 / 0)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 0 g b / alpha)', 'color(srgb-linear 0 0.5 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r 0 b / alpha)', 'color(srgb-linear 0.7 0 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g 0 / alpha)', 'color(srgb-linear 0.7 0.5 0)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b / 0)', 'color(srgb-linear 0.7 0.5 0.3 / 0)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear 0 g b / alpha)', 'color(srgb-linear 0 0.5 0.3 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r 0 b / alpha)', 'color(srgb-linear 0.7 0 0.3 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g 0 / alpha)', 'color(srgb-linear 0.7 0.5 0 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g b / 0)', 'color(srgb-linear 0.7 0.5 0.3 / 0)'],

	// Testing replacement with a constant.
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 0.2 g b / alpha)', 'color(srgb-linear 0.2 0.5 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 20% g b / alpha)', 'color(srgb-linear 0.2 0.5 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r 0.2 b / alpha)', 'color(srgb-linear 0.7 0.2 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r 20% b / alpha)', 'color(srgb-linear 0.7 0.2 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g 0.2 / alpha)', 'color(srgb-linear 0.7 0.5 0.2)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g 20% / alpha)', 'color(srgb-linear 0.7 0.5 0.2)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b / 0.2)', 'color(srgb-linear 0.7 0.5 0.3 / 0.2)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b / 20%)', 'color(srgb-linear 0.7 0.5 0.3 / 0.2)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear 0.2 g b / alpha)', 'color(srgb-linear 0.2 0.5 0.3 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear 20% g b / alpha)', 'color(srgb-linear 0.2 0.5 0.3 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r 0.2 b / alpha)', 'color(srgb-linear 0.7 0.2 0.3 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r 20% b / alpha)', 'color(srgb-linear 0.7 0.2 0.3 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g 0.2 / alpha)', 'color(srgb-linear 0.7 0.5 0.2 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g 20% / alpha)', 'color(srgb-linear 0.7 0.5 0.2 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g b / 0.2)', 'color(srgb-linear 0.7 0.5 0.3 / 0.2)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g b / 20%)', 'color(srgb-linear 0.7 0.5 0.3 / 0.2)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 2 3 4)', 'color(srgb-linear 2 3 4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 2 3 4 / 5)', 'color(srgb-linear 2 3 4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear -2 -3 -4)', 'color(srgb-linear -2 -3 -4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear -2 -3 -4 / -5)', 'color(srgb-linear -2 -3 -4 / 0)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 200% 300% 400%)', 'color(srgb-linear 2 3 4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear 200% 300% 400% / 500%)', 'color(srgb-linear 2 3 4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear -200% -300% -400%)', 'color(srgb-linear -2 -3 -4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear -200% -300% -400% / -500%)', 'color(srgb-linear -2 -3 -4 / 0)'],

	// Testing valid permutation (types match).
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear g b r)', 'color(srgb-linear 0.5 0.3 0.7)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear b alpha r / g)', 'color(srgb-linear 0.3 1 0.7 / 0.5)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r r r / r)', 'color(srgb-linear 0.7 0.7 0.7 / 0.7)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear alpha alpha alpha / alpha)', 'color(srgb-linear 1 1 1)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear g b r)', 'color(srgb-linear 0.5 0.3 0.7 / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear b alpha r / g)', 'color(srgb-linear 0.3 0.4 0.7 / 0.5)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r r r / r)', 'color(srgb-linear 0.7 0.7 0.7 / 0.7)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear alpha alpha alpha / alpha)', 'color(srgb-linear 0.4 0.4 0.4 / 0.4)'],

	// Testing out of gamut components.
	['color(from color(srgb-linear 1.7 1.5 1.3) srgb-linear r g b)', 'color(srgb-linear 1.7 1.5 1.3)'],
	['color(from color(srgb-linear 1.7 1.5 1.3) srgb-linear r g b / alpha)', 'color(srgb-linear 1.7 1.5 1.3)'],
	['color(from color(srgb-linear 1.7 1.5 1.3 / 140%) srgb-linear r g b)', 'color(srgb-linear 1.7 1.5 1.3)'],
	['color(from color(srgb-linear 1.7 1.5 1.3 / 140%) srgb-linear r g b / alpha)', 'color(srgb-linear 1.7 1.5 1.3)'],
	['color(from color(srgb-linear -0.7 -0.5 -0.3) srgb-linear r g b)', 'color(srgb-linear -0.7 -0.5 -0.3)'],
	['color(from color(srgb-linear -0.7 -0.5 -0.3) srgb-linear r g b / alpha)', 'color(srgb-linear -0.7 -0.5 -0.3)'],
	['color(from color(srgb-linear -0.7 -0.5 -0.3 / -40%) srgb-linear r g b)', 'color(srgb-linear -0.7 -0.5 -0.3 / 0)'],
	['color(from color(srgb-linear -0.7 -0.5 -0.3 / -40%) srgb-linear r g b / alpha)', 'color(srgb-linear -0.7 -0.5 -0.3 / 0)'],

	// Testing with calc().
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear calc(r) calc(g) calc(b))', 'color(srgb-linear 0.7 0.5 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear calc(r) calc(g) calc(b) / calc(alpha))', 'color(srgb-linear 0.7 0.5 0.3 / 0.4)'],

	// Testing with 'none'.
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear none none none)', 'color(srgb-linear none none none)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear none none none / none)', 'color(srgb-linear none none none / none)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g none)', 'color(srgb-linear 0.7 0.5 none)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g none / alpha)', 'color(srgb-linear 0.7 0.5 none)'],
	['color(from color(srgb-linear 0.7 0.5 0.3) srgb-linear r g b / none)', 'color(srgb-linear 0.7 0.5 0.3 / none)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g none / alpha)', 'color(srgb-linear 0.7 0.5 none / 0.4)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / 40%) srgb-linear r g b / none)', 'color(srgb-linear 0.7 0.5 0.3 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(srgb-linear none none none) srgb-linear r g b)', 'color(srgb-linear 0 0 0)'],
	['color(from color(srgb-linear none none none / none) srgb-linear r g b / alpha)', 'color(srgb-linear 0 0 0 / 0)'],
	['color(from color(srgb-linear 0.7 none 0.3) srgb-linear r g b)', 'color(srgb-linear 0.7 0 0.3)'],
	['color(from color(srgb-linear 0.7 0.5 0.3 / none) srgb-linear r g b / alpha)', 'color(srgb-linear 0.7 0.5 0.3 / 0)'],

	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g b)', 'color(a98-rgb 0.7 0.5 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g b / alpha)', 'color(a98-rgb 0.7 0.5 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g b)', 'color(a98-rgb 0.7 0.5 0.3 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g b / alpha)', 'color(a98-rgb 0.7 0.5 0.3 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g b) a98-rgb r g b)', 'color(a98-rgb 0.7 0.5 0.3)'],

	// Testing replacement with 0.
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 0 0 0)', 'color(a98-rgb 0 0 0)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 0 0 0 / 0)', 'color(a98-rgb 0 0 0 / 0)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 0 g b / alpha)', 'color(a98-rgb 0 0.5 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r 0 b / alpha)', 'color(a98-rgb 0.7 0 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g 0 / alpha)', 'color(a98-rgb 0.7 0.5 0)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g b / 0)', 'color(a98-rgb 0.7 0.5 0.3 / 0)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb 0 g b / alpha)', 'color(a98-rgb 0 0.5 0.3 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r 0 b / alpha)', 'color(a98-rgb 0.7 0 0.3 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g 0 / alpha)', 'color(a98-rgb 0.7 0.5 0 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g b / 0)', 'color(a98-rgb 0.7 0.5 0.3 / 0)'],

	// Testing replacement with a constant.
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 0.2 g b / alpha)', 'color(a98-rgb 0.2 0.5 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 20% g b / alpha)', 'color(a98-rgb 0.2 0.5 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r 0.2 b / alpha)', 'color(a98-rgb 0.7 0.2 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r 20% b / alpha)', 'color(a98-rgb 0.7 0.2 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g 0.2 / alpha)', 'color(a98-rgb 0.7 0.5 0.2)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g 20% / alpha)', 'color(a98-rgb 0.7 0.5 0.2)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g b / 0.2)', 'color(a98-rgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g b / 20%)', 'color(a98-rgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb 0.2 g b / alpha)', 'color(a98-rgb 0.2 0.5 0.3 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb 20% g b / alpha)', 'color(a98-rgb 0.2 0.5 0.3 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r 0.2 b / alpha)', 'color(a98-rgb 0.7 0.2 0.3 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r 20% b / alpha)', 'color(a98-rgb 0.7 0.2 0.3 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g 0.2 / alpha)', 'color(a98-rgb 0.7 0.5 0.2 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g 20% / alpha)', 'color(a98-rgb 0.7 0.5 0.2 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g b / 0.2)', 'color(a98-rgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g b / 20%)', 'color(a98-rgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 2 3 4)', 'color(a98-rgb 2 3 4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 2 3 4 / 5)', 'color(a98-rgb 2 3 4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb -2 -3 -4)', 'color(a98-rgb -2 -3 -4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb -2 -3 -4 / -5)', 'color(a98-rgb -2 -3 -4 / 0)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 200% 300% 400%)', 'color(a98-rgb 2 3 4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb 200% 300% 400% / 500%)', 'color(a98-rgb 2 3 4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb -200% -300% -400%)', 'color(a98-rgb -2 -3 -4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb -200% -300% -400% / -500%)', 'color(a98-rgb -2 -3 -4 / 0)'],

	// Testing valid permutation (types match).
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb g b r)', 'color(a98-rgb 0.5 0.3 0.7)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb b alpha r / g)', 'color(a98-rgb 0.3 1 0.7 / 0.5)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r r r / r)', 'color(a98-rgb 0.7 0.7 0.7 / 0.7)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb alpha alpha alpha / alpha)', 'color(a98-rgb 1 1 1)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb g b r)', 'color(a98-rgb 0.5 0.3 0.7 / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb b alpha r / g)', 'color(a98-rgb 0.3 0.4 0.7 / 0.5)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r r r / r)', 'color(a98-rgb 0.7 0.7 0.7 / 0.7)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb alpha alpha alpha / alpha)', 'color(a98-rgb 0.4 0.4 0.4 / 0.4)'],

	// Testing out of gamut components.
	['color(from color(a98-rgb 1.7 1.5 1.3) a98-rgb r g b)', 'color(a98-rgb 1.7 1.5 1.3)'],
	['color(from color(a98-rgb 1.7 1.5 1.3) a98-rgb r g b / alpha)', 'color(a98-rgb 1.7 1.5 1.3)'],
	['color(from color(a98-rgb 1.7 1.5 1.3 / 140%) a98-rgb r g b)', 'color(a98-rgb 1.7 1.5 1.3)'],
	['color(from color(a98-rgb 1.7 1.5 1.3 / 140%) a98-rgb r g b / alpha)', 'color(a98-rgb 1.7 1.5 1.3)'],
	['color(from color(a98-rgb -0.7 -0.5 -0.3) a98-rgb r g b)', 'color(a98-rgb -0.7 -0.5 -0.3)'],
	['color(from color(a98-rgb -0.7 -0.5 -0.3) a98-rgb r g b / alpha)', 'color(a98-rgb -0.7 -0.5 -0.3)'],
	['color(from color(a98-rgb -0.7 -0.5 -0.3 / -40%) a98-rgb r g b)', 'color(a98-rgb -0.7 -0.5 -0.3 / 0)'],
	['color(from color(a98-rgb -0.7 -0.5 -0.3 / -40%) a98-rgb r g b / alpha)', 'color(a98-rgb -0.7 -0.5 -0.3 / 0)'],

	// Testing with calc().
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb calc(r) calc(g) calc(b))', 'color(a98-rgb 0.7 0.5 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb calc(r) calc(g) calc(b) / calc(alpha))', 'color(a98-rgb 0.7 0.5 0.3 / 0.4)'],

	// Testing with 'none'.
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb none none none)', 'color(a98-rgb none none none)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb none none none / none)', 'color(a98-rgb none none none / none)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g none)', 'color(a98-rgb 0.7 0.5 none)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g none / alpha)', 'color(a98-rgb 0.7 0.5 none)'],
	['color(from color(a98-rgb 0.7 0.5 0.3) a98-rgb r g b / none)', 'color(a98-rgb 0.7 0.5 0.3 / none)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g none / alpha)', 'color(a98-rgb 0.7 0.5 none / 0.4)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / 40%) a98-rgb r g b / none)', 'color(a98-rgb 0.7 0.5 0.3 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(a98-rgb none none none) a98-rgb r g b)', 'color(a98-rgb 0 0 0)'],
	['color(from color(a98-rgb none none none / none) a98-rgb r g b / alpha)', 'color(a98-rgb 0 0 0 / 0)'],
	['color(from color(a98-rgb 0.7 none 0.3) a98-rgb r g b)', 'color(a98-rgb 0.7 0 0.3)'],
	['color(from color(a98-rgb 0.7 0.5 0.3 / none) a98-rgb r g b / alpha)', 'color(a98-rgb 0.7 0.5 0.3 / 0)'],

	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g b)', 'color(rec2020 0.7 0.5 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g b / alpha)', 'color(rec2020 0.7 0.5 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g b)', 'color(rec2020 0.7 0.5 0.3 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g b / alpha)', 'color(rec2020 0.7 0.5 0.3 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(rec2020 0.7 0.5 0.3) rec2020 r g b) rec2020 r g b)', 'color(rec2020 0.7 0.5 0.3)'],

	// Testing replacement with 0.
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 0 0 0)', 'color(rec2020 0 0 0)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 0 0 0 / 0)', 'color(rec2020 0 0 0 / 0)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 0 g b / alpha)', 'color(rec2020 0 0.5 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r 0 b / alpha)', 'color(rec2020 0.7 0 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g 0 / alpha)', 'color(rec2020 0.7 0.5 0)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g b / 0)', 'color(rec2020 0.7 0.5 0.3 / 0)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 0 g b / alpha)', 'color(rec2020 0 0.5 0.3 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r 0 b / alpha)', 'color(rec2020 0.7 0 0.3 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g 0 / alpha)', 'color(rec2020 0.7 0.5 0 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g b / 0)', 'color(rec2020 0.7 0.5 0.3 / 0)'],

	// Testing replacement with a constant.
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 0.2 g b / alpha)', 'color(rec2020 0.2 0.5 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 20% g b / alpha)', 'color(rec2020 0.2 0.5 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r 0.2 b / alpha)', 'color(rec2020 0.7 0.2 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r 20% b / alpha)', 'color(rec2020 0.7 0.2 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g 0.2 / alpha)', 'color(rec2020 0.7 0.5 0.2)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g 20% / alpha)', 'color(rec2020 0.7 0.5 0.2)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g b / 0.2)', 'color(rec2020 0.7 0.5 0.3 / 0.2)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g b / 20%)', 'color(rec2020 0.7 0.5 0.3 / 0.2)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 0.2 g b / alpha)', 'color(rec2020 0.2 0.5 0.3 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 20% g b / alpha)', 'color(rec2020 0.2 0.5 0.3 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r 0.2 b / alpha)', 'color(rec2020 0.7 0.2 0.3 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r 20% b / alpha)', 'color(rec2020 0.7 0.2 0.3 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g 0.2 / alpha)', 'color(rec2020 0.7 0.5 0.2 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g 20% / alpha)', 'color(rec2020 0.7 0.5 0.2 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g b / 0.2)', 'color(rec2020 0.7 0.5 0.3 / 0.2)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g b / 20%)', 'color(rec2020 0.7 0.5 0.3 / 0.2)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 2 3 4)', 'color(rec2020 2 3 4)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 2 3 4 / 5)', 'color(rec2020 2 3 4)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 -2 -3 -4)', 'color(rec2020 -2 -3 -4)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 -2 -3 -4 / -5)', 'color(rec2020 -2 -3 -4 / 0)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 200% 300% 400%)', 'color(rec2020 2 3 4)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 200% 300% 400% / 500%)', 'color(rec2020 2 3 4)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 -200% -300% -400%)', 'color(rec2020 -2 -3 -4)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 -200% -300% -400% / -500%)', 'color(rec2020 -2 -3 -4 / 0)'],

	// Testing valid permutation (types match).
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 g b r)', 'color(rec2020 0.5 0.3 0.7)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 b alpha r / g)', 'color(rec2020 0.3 1 0.7 / 0.5)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r r r / r)', 'color(rec2020 0.7 0.7 0.7 / 0.7)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 alpha alpha alpha / alpha)', 'color(rec2020 1 1 1)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 g b r)', 'color(rec2020 0.5 0.3 0.7 / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 b alpha r / g)', 'color(rec2020 0.3 0.4 0.7 / 0.5)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r r r / r)', 'color(rec2020 0.7 0.7 0.7 / 0.7)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 alpha alpha alpha / alpha)', 'color(rec2020 0.4 0.4 0.4 / 0.4)'],

	// Testing out of gamut components.
	['color(from color(rec2020 1.7 1.5 1.3) rec2020 r g b)', 'color(rec2020 1.7 1.5 1.3)'],
	['color(from color(rec2020 1.7 1.5 1.3) rec2020 r g b / alpha)', 'color(rec2020 1.7 1.5 1.3)'],
	['color(from color(rec2020 1.7 1.5 1.3 / 140%) rec2020 r g b)', 'color(rec2020 1.7 1.5 1.3)'],
	['color(from color(rec2020 1.7 1.5 1.3 / 140%) rec2020 r g b / alpha)', 'color(rec2020 1.7 1.5 1.3)'],
	['color(from color(rec2020 -0.7 -0.5 -0.3) rec2020 r g b)', 'color(rec2020 -0.7 -0.5 -0.3)'],
	['color(from color(rec2020 -0.7 -0.5 -0.3) rec2020 r g b / alpha)', 'color(rec2020 -0.7 -0.5 -0.3)'],
	['color(from color(rec2020 -0.7 -0.5 -0.3 / -40%) rec2020 r g b)', 'color(rec2020 -0.7 -0.5 -0.3 / 0)'],
	['color(from color(rec2020 -0.7 -0.5 -0.3 / -40%) rec2020 r g b / alpha)', 'color(rec2020 -0.7 -0.5 -0.3 / 0)'],

	// Testing with calc().
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 calc(r) calc(g) calc(b))', 'color(rec2020 0.7 0.5 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 calc(r) calc(g) calc(b) / calc(alpha))', 'color(rec2020 0.7 0.5 0.3 / 0.4)'],

	// Testing with 'none'.
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 none none none)', 'color(rec2020 none none none)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 none none none / none)', 'color(rec2020 none none none / none)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g none)', 'color(rec2020 0.7 0.5 none)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g none / alpha)', 'color(rec2020 0.7 0.5 none)'],
	['color(from color(rec2020 0.7 0.5 0.3) rec2020 r g b / none)', 'color(rec2020 0.7 0.5 0.3 / none)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g none / alpha)', 'color(rec2020 0.7 0.5 none / 0.4)'],
	['color(from color(rec2020 0.7 0.5 0.3 / 40%) rec2020 r g b / none)', 'color(rec2020 0.7 0.5 0.3 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(rec2020 none none none) rec2020 r g b)', 'color(rec2020 0 0 0)'],
	['color(from color(rec2020 none none none / none) rec2020 r g b / alpha)', 'color(rec2020 0 0 0 / 0)'],
	['color(from color(rec2020 0.7 none 0.3) rec2020 r g b)', 'color(rec2020 0.7 0 0.3)'],
	['color(from color(rec2020 0.7 0.5 0.3 / none) rec2020 r g b / alpha)', 'color(rec2020 0.7 0.5 0.3 / 0)'],

	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g b)', 'color(prophoto-rgb 0.7 0.5 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g b / alpha)', 'color(prophoto-rgb 0.7 0.5 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g b)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g b / alpha)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g b) prophoto-rgb r g b)', 'color(prophoto-rgb 0.7 0.5 0.3)'],

	// Testing replacement with 0.
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 0 0 0)', 'color(prophoto-rgb 0 0 0)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 0 0 0 / 0)', 'color(prophoto-rgb 0 0 0 / 0)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 0 g b / alpha)', 'color(prophoto-rgb 0 0.5 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r 0 b / alpha)', 'color(prophoto-rgb 0.7 0 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g 0 / alpha)', 'color(prophoto-rgb 0.7 0.5 0)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g b / 0)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb 0 g b / alpha)', 'color(prophoto-rgb 0 0.5 0.3 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r 0 b / alpha)', 'color(prophoto-rgb 0.7 0 0.3 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g 0 / alpha)', 'color(prophoto-rgb 0.7 0.5 0 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g b / 0)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0)'],

	// Testing replacement with a constant.
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 0.2 g b / alpha)', 'color(prophoto-rgb 0.2 0.5 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 20% g b / alpha)', 'color(prophoto-rgb 0.2 0.5 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r 0.2 b / alpha)', 'color(prophoto-rgb 0.7 0.2 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r 20% b / alpha)', 'color(prophoto-rgb 0.7 0.2 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g 0.2 / alpha)', 'color(prophoto-rgb 0.7 0.5 0.2)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g 20% / alpha)', 'color(prophoto-rgb 0.7 0.5 0.2)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g b / 0.2)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g b / 20%)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb 0.2 g b / alpha)', 'color(prophoto-rgb 0.2 0.5 0.3 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb 20% g b / alpha)', 'color(prophoto-rgb 0.2 0.5 0.3 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r 0.2 b / alpha)', 'color(prophoto-rgb 0.7 0.2 0.3 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r 20% b / alpha)', 'color(prophoto-rgb 0.7 0.2 0.3 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g 0.2 / alpha)', 'color(prophoto-rgb 0.7 0.5 0.2 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g 20% / alpha)', 'color(prophoto-rgb 0.7 0.5 0.2 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g b / 0.2)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g b / 20%)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0.2)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 2 3 4)', 'color(prophoto-rgb 2 3 4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 2 3 4 / 5)', 'color(prophoto-rgb 2 3 4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb -2 -3 -4)', 'color(prophoto-rgb -2 -3 -4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb -2 -3 -4 / -5)', 'color(prophoto-rgb -2 -3 -4 / 0)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 200% 300% 400%)', 'color(prophoto-rgb 2 3 4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb 200% 300% 400% / 500%)', 'color(prophoto-rgb 2 3 4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb -200% -300% -400%)', 'color(prophoto-rgb -2 -3 -4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb -200% -300% -400% / -500%)', 'color(prophoto-rgb -2 -3 -4 / 0)'],

	// Testing valid permutation (types match).
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb g b r)', 'color(prophoto-rgb 0.5 0.3 0.7)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb b alpha r / g)', 'color(prophoto-rgb 0.3 1 0.7 / 0.5)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r r r / r)', 'color(prophoto-rgb 0.7 0.7 0.7 / 0.7)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb alpha alpha alpha / alpha)', 'color(prophoto-rgb 1 1 1)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb g b r)', 'color(prophoto-rgb 0.5 0.3 0.7 / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb b alpha r / g)', 'color(prophoto-rgb 0.3 0.4 0.7 / 0.5)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r r r / r)', 'color(prophoto-rgb 0.7 0.7 0.7 / 0.7)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb alpha alpha alpha / alpha)', 'color(prophoto-rgb 0.4 0.4 0.4 / 0.4)'],

	// Testing out of gamut components.
	['color(from color(prophoto-rgb 1.7 1.5 1.3) prophoto-rgb r g b)', 'color(prophoto-rgb 1.7 1.5 1.3)'],
	['color(from color(prophoto-rgb 1.7 1.5 1.3) prophoto-rgb r g b / alpha)', 'color(prophoto-rgb 1.7 1.5 1.3)'],
	['color(from color(prophoto-rgb 1.7 1.5 1.3 / 140%) prophoto-rgb r g b)', 'color(prophoto-rgb 1.7 1.5 1.3)'],
	['color(from color(prophoto-rgb 1.7 1.5 1.3 / 140%) prophoto-rgb r g b / alpha)', 'color(prophoto-rgb 1.7 1.5 1.3)'],
	['color(from color(prophoto-rgb -0.7 -0.5 -0.3) prophoto-rgb r g b)', 'color(prophoto-rgb -0.7 -0.5 -0.3)'],
	['color(from color(prophoto-rgb -0.7 -0.5 -0.3) prophoto-rgb r g b / alpha)', 'color(prophoto-rgb -0.7 -0.5 -0.3)'],
	['color(from color(prophoto-rgb -0.7 -0.5 -0.3 / -40%) prophoto-rgb r g b)', 'color(prophoto-rgb -0.7 -0.5 -0.3 / 0)'],
	['color(from color(prophoto-rgb -0.7 -0.5 -0.3 / -40%) prophoto-rgb r g b / alpha)', 'color(prophoto-rgb -0.7 -0.5 -0.3 / 0)'],

	// Testing with calc().
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb calc(r) calc(g) calc(b))', 'color(prophoto-rgb 0.7 0.5 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb calc(r) calc(g) calc(b) / calc(alpha))', 'color(prophoto-rgb 0.7 0.5 0.3 / 0.4)'],

	// Testing with 'none'.
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb none none none)', 'color(prophoto-rgb none none none)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb none none none / none)', 'color(prophoto-rgb none none none / none)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g none)', 'color(prophoto-rgb 0.7 0.5 none)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g none / alpha)', 'color(prophoto-rgb 0.7 0.5 none)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3) prophoto-rgb r g b / none)', 'color(prophoto-rgb 0.7 0.5 0.3 / none)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g none / alpha)', 'color(prophoto-rgb 0.7 0.5 none / 0.4)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / 40%) prophoto-rgb r g b / none)', 'color(prophoto-rgb 0.7 0.5 0.3 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(prophoto-rgb none none none) prophoto-rgb r g b)', 'color(prophoto-rgb 0 0 0)'],
	['color(from color(prophoto-rgb none none none / none) prophoto-rgb r g b / alpha)', 'color(prophoto-rgb 0 0 0 / 0)'],
	['color(from color(prophoto-rgb 0.7 none 0.3) prophoto-rgb r g b)', 'color(prophoto-rgb 0.7 0 0.3)'],
	['color(from color(prophoto-rgb 0.7 0.5 0.3 / none) prophoto-rgb r g b / alpha)', 'color(prophoto-rgb 0.7 0.5 0.3 / 0)'],

	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g b)', 'color(display-p3 0.7 0.5 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g b / alpha)', 'color(display-p3 0.7 0.5 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g b)', 'color(display-p3 0.7 0.5 0.3 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g b / alpha)', 'color(display-p3 0.7 0.5 0.3 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(display-p3 0.7 0.5 0.3) display-p3 r g b) display-p3 r g b)', 'color(display-p3 0.7 0.5 0.3)'],

	// Testing replacement with 0.
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 0 0 0)', 'color(display-p3 0 0 0)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 0 0 0 / 0)', 'color(display-p3 0 0 0 / 0)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 0 g b / alpha)', 'color(display-p3 0 0.5 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r 0 b / alpha)', 'color(display-p3 0.7 0 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g 0 / alpha)', 'color(display-p3 0.7 0.5 0)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g b / 0)', 'color(display-p3 0.7 0.5 0.3 / 0)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 0 g b / alpha)', 'color(display-p3 0 0.5 0.3 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r 0 b / alpha)', 'color(display-p3 0.7 0 0.3 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g 0 / alpha)', 'color(display-p3 0.7 0.5 0 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g b / 0)', 'color(display-p3 0.7 0.5 0.3 / 0)'],

	// Testing replacement with a constant.
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 0.2 g b / alpha)', 'color(display-p3 0.2 0.5 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 20% g b / alpha)', 'color(display-p3 0.2 0.5 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r 0.2 b / alpha)', 'color(display-p3 0.7 0.2 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r 20% b / alpha)', 'color(display-p3 0.7 0.2 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g 0.2 / alpha)', 'color(display-p3 0.7 0.5 0.2)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g 20% / alpha)', 'color(display-p3 0.7 0.5 0.2)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g b / 0.2)', 'color(display-p3 0.7 0.5 0.3 / 0.2)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g b / 20%)', 'color(display-p3 0.7 0.5 0.3 / 0.2)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 0.2 g b / alpha)', 'color(display-p3 0.2 0.5 0.3 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 20% g b / alpha)', 'color(display-p3 0.2 0.5 0.3 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r 0.2 b / alpha)', 'color(display-p3 0.7 0.2 0.3 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r 20% b / alpha)', 'color(display-p3 0.7 0.2 0.3 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g 0.2 / alpha)', 'color(display-p3 0.7 0.5 0.2 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g 20% / alpha)', 'color(display-p3 0.7 0.5 0.2 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g b / 0.2)', 'color(display-p3 0.7 0.5 0.3 / 0.2)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g b / 20%)', 'color(display-p3 0.7 0.5 0.3 / 0.2)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 2 3 4)', 'color(display-p3 2 3 4)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 2 3 4 / 5)', 'color(display-p3 2 3 4)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 -2 -3 -4)', 'color(display-p3 -2 -3 -4)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 -2 -3 -4 / -5)', 'color(display-p3 -2 -3 -4 / 0)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 200% 300% 400%)', 'color(display-p3 2 3 4)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 200% 300% 400% / 500%)', 'color(display-p3 2 3 4)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 -200% -300% -400%)', 'color(display-p3 -2 -3 -4)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 -200% -300% -400% / -500%)', 'color(display-p3 -2 -3 -4 / 0)'],

	// Testing valid permutation (types match).
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 g b r)', 'color(display-p3 0.5 0.3 0.7)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 b alpha r / g)', 'color(display-p3 0.3 1 0.7 / 0.5)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r r r / r)', 'color(display-p3 0.7 0.7 0.7 / 0.7)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 alpha alpha alpha / alpha)', 'color(display-p3 1 1 1)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 g b r)', 'color(display-p3 0.5 0.3 0.7 / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 b alpha r / g)', 'color(display-p3 0.3 0.4 0.7 / 0.5)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r r r / r)', 'color(display-p3 0.7 0.7 0.7 / 0.7)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 alpha alpha alpha / alpha)', 'color(display-p3 0.4 0.4 0.4 / 0.4)'],

	// Testing out of gamut components.
	['color(from color(display-p3 1.7 1.5 1.3) display-p3 r g b)', 'color(display-p3 1.7 1.5 1.3)'],
	['color(from color(display-p3 1.7 1.5 1.3) display-p3 r g b / alpha)', 'color(display-p3 1.7 1.5 1.3)'],
	['color(from color(display-p3 1.7 1.5 1.3 / 140%) display-p3 r g b)', 'color(display-p3 1.7 1.5 1.3)'],
	['color(from color(display-p3 1.7 1.5 1.3 / 140%) display-p3 r g b / alpha)', 'color(display-p3 1.7 1.5 1.3)'],
	['color(from color(display-p3 -0.7 -0.5 -0.3) display-p3 r g b)', 'color(display-p3 -0.7 -0.5 -0.3)'],
	['color(from color(display-p3 -0.7 -0.5 -0.3) display-p3 r g b / alpha)', 'color(display-p3 -0.7 -0.5 -0.3)'],
	['color(from color(display-p3 -0.7 -0.5 -0.3 / -40%) display-p3 r g b)', 'color(display-p3 -0.7 -0.5 -0.3 / 0)'],
	['color(from color(display-p3 -0.7 -0.5 -0.3 / -40%) display-p3 r g b / alpha)', 'color(display-p3 -0.7 -0.5 -0.3 / 0)'],

	// Testing with calc().
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 calc(r) calc(g) calc(b))', 'color(display-p3 0.7 0.5 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 calc(r) calc(g) calc(b) / calc(alpha))', 'color(display-p3 0.7 0.5 0.3 / 0.4)'],

	// Testing with 'none'.
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 none none none)', 'color(display-p3 none none none)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 none none none / none)', 'color(display-p3 none none none / none)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g none)', 'color(display-p3 0.7 0.5 none)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g none / alpha)', 'color(display-p3 0.7 0.5 none)'],
	['color(from color(display-p3 0.7 0.5 0.3) display-p3 r g b / none)', 'color(display-p3 0.7 0.5 0.3 / none)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g none / alpha)', 'color(display-p3 0.7 0.5 none / 0.4)'],
	['color(from color(display-p3 0.7 0.5 0.3 / 40%) display-p3 r g b / none)', 'color(display-p3 0.7 0.5 0.3 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(display-p3 none none none) display-p3 r g b)', 'color(display-p3 0 0 0)'],
	['color(from color(display-p3 none none none / none) display-p3 r g b / alpha)', 'color(display-p3 0 0 0 / 0)'],
	['color(from color(display-p3 0.7 none 0.3) display-p3 r g b)', 'color(display-p3 0.7 0 0.3)'],
	['color(from color(display-p3 0.7 0.5 0.3 / none) display-p3 r g b / alpha)', 'color(display-p3 0.7 0.5 0.3 / 0)'],

	['color(from color(xyz 7 -20.5 100) xyz x y z)', 'color(xyz-d65 7 -20.5 100)'],
	['color(from color(xyz 7 -20.5 100) xyz x y z / alpha)', 'color(xyz-d65 7 -20.5 100)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x y z)', 'color(xyz-d65 7 -20.5 100 / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x y z / alpha)', 'color(xyz-d65 7 -20.5 100 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(xyz 7 -20.5 100) xyz x y z) xyz x y z)', 'color(xyz-d65 7 -20.5 100)'],

	// Testing replacement with 0.
	['color(from color(xyz 7 -20.5 100) xyz 0 0 0)', 'color(xyz-d65 0 0 0)'],
	['color(from color(xyz 7 -20.5 100) xyz 0 0 0 / 0)', 'color(xyz-d65 0 0 0 / 0)'],
	['color(from color(xyz 7 -20.5 100) xyz 0 y z / alpha)', 'color(xyz-d65 0 -20.5 100)'],
	['color(from color(xyz 7 -20.5 100) xyz x 0 z / alpha)', 'color(xyz-d65 7 0 100)'],
	['color(from color(xyz 7 -20.5 100) xyz x y 0 / alpha)', 'color(xyz-d65 7 -20.5 0)'],
	['color(from color(xyz 7 -20.5 100) xyz x y z / 0)', 'color(xyz-d65 7 -20.5 100 / 0)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz 0 y z / alpha)', 'color(xyz-d65 0 -20.5 100 / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x 0 z / alpha)', 'color(xyz-d65 7 0 100 / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x y 0 / alpha)', 'color(xyz-d65 7 -20.5 0 / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x y z / 0)', 'color(xyz-d65 7 -20.5 100 / 0)'],

	// Testing replacement with a constant.
	['color(from color(xyz 7 -20.5 100) xyz 0.2 y z / alpha)', 'color(xyz-d65 0.2 -20.5 100)'],
	['color(from color(xyz 7 -20.5 100) xyz x 0.2 z / alpha)', 'color(xyz-d65 7 0.2 100)'],
	['color(from color(xyz 7 -20.5 100) xyz x y 0.2 / alpha)', 'color(xyz-d65 7 -20.5 0.2)'],
	['color(from color(xyz 7 -20.5 100) xyz x y z / 0.2)', 'color(xyz-d65 7 -20.5 100 / 0.2)'],
	['color(from color(xyz 7 -20.5 100) xyz x y z / 20%)', 'color(xyz-d65 7 -20.5 100 / 0.2)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz 0.2 y z / alpha)', 'color(xyz-d65 0.2 -20.5 100 / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x 0.2 z / alpha)', 'color(xyz-d65 7 0.2 100 / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x y 0.2 / alpha)', 'color(xyz-d65 7 -20.5 0.2 / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x y z / 0.2)', 'color(xyz-d65 7 -20.5 100 / 0.2)'],

	// Testing valid permutation (types match).
	['color(from color(xyz 7 -20.5 100) xyz y z x)', 'color(xyz-d65 -20.5 100 7)'],
	['color(from color(xyz 7 -20.5 100) xyz x x x / x)', 'color(xyz-d65 7 7 7)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz y z x)', 'color(xyz-d65 -20.5 100 7 / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x x x / x)', 'color(xyz-d65 7 7 7)'],

	// Testing with calc().
	['color(from color(xyz 7 -20.5 100) xyz calc(x) calc(y) calc(z))', 'color(xyz-d65 7 -20.5 100)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz calc(x) calc(y) calc(z) / calc(alpha))', 'color(xyz-d65 7 -20.5 100 / 0.4)'],

	// Testing with 'none'.
	['color(from color(xyz 7 -20.5 100) xyz none none none)', 'color(xyz-d65 none none none)'],
	['color(from color(xyz 7 -20.5 100) xyz none none none / none)', 'color(xyz-d65 none none none / none)'],
	['color(from color(xyz 7 -20.5 100) xyz x y none)', 'color(xyz-d65 7 -20.5 none)'],
	['color(from color(xyz 7 -20.5 100) xyz x y none / alpha)', 'color(xyz-d65 7 -20.5 none)'],
	['color(from color(xyz 7 -20.5 100) xyz x y z / none)', 'color(xyz-d65 7 -20.5 100 / none)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x y none / alpha)', 'color(xyz-d65 7 -20.5 none / 0.4)'],
	['color(from color(xyz 7 -20.5 100 / 40%) xyz x y z / none)', 'color(xyz-d65 7 -20.5 100 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(xyz none none none) xyz x y z)', 'color(xyz-d65 0 0 0)'],
	['color(from color(xyz none none none / none) xyz x y z / alpha)', 'color(xyz-d65 0 0 0 / 0)'],
	['color(from color(xyz 7 none 100) xyz x y z)', 'color(xyz-d65 7 0 100)'],
	['color(from color(xyz 7 -20.5 100 / none) xyz x y z / alpha)', 'color(xyz-d65 7 -20.5 100 / 0)'],

	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y z)', 'color(xyz-d65 7 -20.5 100)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y z / alpha)', 'color(xyz-d65 7 -20.5 100)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x y z)', 'color(xyz-d65 7 -20.5 100 / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x y z / alpha)', 'color(xyz-d65 7 -20.5 100 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y z) xyz-d65 x y z)', 'color(xyz-d65 7 -20.5 100)'],

	// Testing replacement with 0.
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 0 0 0)', 'color(xyz-d65 0 0 0)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 0 0 0 / 0)', 'color(xyz-d65 0 0 0 / 0)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 0 y z / alpha)', 'color(xyz-d65 0 -20.5 100)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x 0 z / alpha)', 'color(xyz-d65 7 0 100)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y 0 / alpha)', 'color(xyz-d65 7 -20.5 0)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y z / 0)', 'color(xyz-d65 7 -20.5 100 / 0)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 0 y z / alpha)', 'color(xyz-d65 0 -20.5 100 / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x 0 z / alpha)', 'color(xyz-d65 7 0 100 / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x y 0 / alpha)', 'color(xyz-d65 7 -20.5 0 / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x y z / 0)', 'color(xyz-d65 7 -20.5 100 / 0)'],

	// Testing replacement with a constant.
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 0.2 y z / alpha)', 'color(xyz-d65 0.2 -20.5 100)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x 0.2 z / alpha)', 'color(xyz-d65 7 0.2 100)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y 0.2 / alpha)', 'color(xyz-d65 7 -20.5 0.2)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y z / 0.2)', 'color(xyz-d65 7 -20.5 100 / 0.2)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y z / 20%)', 'color(xyz-d65 7 -20.5 100 / 0.2)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 0.2 y z / alpha)', 'color(xyz-d65 0.2 -20.5 100 / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x 0.2 z / alpha)', 'color(xyz-d65 7 0.2 100 / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x y 0.2 / alpha)', 'color(xyz-d65 7 -20.5 0.2 / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x y z / 0.2)', 'color(xyz-d65 7 -20.5 100 / 0.2)'],

	// Testing valid permutation (types match).
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 y z x)', 'color(xyz-d65 -20.5 100 7)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x x x / x)', 'color(xyz-d65 7 7 7)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 y z x)', 'color(xyz-d65 -20.5 100 7 / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x x x / x)', 'color(xyz-d65 7 7 7)'],

	// Testing with calc().
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 calc(x) calc(y) calc(z))', 'color(xyz-d65 7 -20.5 100)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 calc(x) calc(y) calc(z) / calc(alpha))', 'color(xyz-d65 7 -20.5 100 / 0.4)'],

	// Testing with 'none'.
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 none none none)', 'color(xyz-d65 none none none)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 none none none / none)', 'color(xyz-d65 none none none / none)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y none)', 'color(xyz-d65 7 -20.5 none)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y none / alpha)', 'color(xyz-d65 7 -20.5 none)'],
	['color(from color(xyz-d65 7 -20.5 100) xyz-d65 x y z / none)', 'color(xyz-d65 7 -20.5 100 / none)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x y none / alpha)', 'color(xyz-d65 7 -20.5 none / 0.4)'],
	['color(from color(xyz-d65 7 -20.5 100 / 40%) xyz-d65 x y z / none)', 'color(xyz-d65 7 -20.5 100 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(xyz-d65 none none none) xyz-d65 x y z)', 'color(xyz-d65 0 0 0)'],
	['color(from color(xyz-d65 none none none / none) xyz-d65 x y z / alpha)', 'color(xyz-d65 0 0 0 / 0)'],
	['color(from color(xyz-d65 7 none 100) xyz-d65 x y z)', 'color(xyz-d65 7 0 100)'],
	['color(from color(xyz-d65 7 -20.5 100 / none) xyz-d65 x y z / alpha)', 'color(xyz-d65 7 -20.5 100 / 0)'],

	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y z)', 'color(xyz-d50 7 -20.5 100)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y z / alpha)', 'color(xyz-d50 7 -20.5 100)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x y z)', 'color(xyz-d50 7 -20.5 100 / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x y z / alpha)', 'color(xyz-d50 7 -20.5 100 / 0.4)'],

	// Test nesting relative colors.
	['color(from color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y z) xyz-d50 x y z)', 'color(xyz-d50 7 -20.5 100)'],

	// Testing replacement with 0.
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 0 0 0)', 'color(xyz-d50 0 0 0)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 0 0 0 / 0)', 'color(xyz-d50 0 0 0 / 0)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 0 y z / alpha)', 'color(xyz-d50 0 -20.5 100)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x 0 z / alpha)', 'color(xyz-d50 7 0 100)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y 0 / alpha)', 'color(xyz-d50 7 -20.5 0)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y z / 0)', 'color(xyz-d50 7 -20.5 100 / 0)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 0 y z / alpha)', 'color(xyz-d50 0 -20.5 100 / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x 0 z / alpha)', 'color(xyz-d50 7 0 100 / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x y 0 / alpha)', 'color(xyz-d50 7 -20.5 0 / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x y z / 0)', 'color(xyz-d50 7 -20.5 100 / 0)'],

	// Testing replacement with a constant.
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 0.2 y z / alpha)', 'color(xyz-d50 0.2 -20.5 100)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x 0.2 z / alpha)', 'color(xyz-d50 7 0.2 100)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y 0.2 / alpha)', 'color(xyz-d50 7 -20.5 0.2)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y z / 0.2)', 'color(xyz-d50 7 -20.5 100 / 0.2)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y z / 20%)', 'color(xyz-d50 7 -20.5 100 / 0.2)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 0.2 y z / alpha)', 'color(xyz-d50 0.2 -20.5 100 / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x 0.2 z / alpha)', 'color(xyz-d50 7 0.2 100 / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x y 0.2 / alpha)', 'color(xyz-d50 7 -20.5 0.2 / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x y z / 0.2)', 'color(xyz-d50 7 -20.5 100 / 0.2)'],

	// Testing valid permutation (types match).
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 y z x)', 'color(xyz-d50 -20.5 100 7)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x x x / x)', 'color(xyz-d50 7 7 7)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 y z x)', 'color(xyz-d50 -20.5 100 7 / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x x x / x)', 'color(xyz-d50 7 7 7)'],

	// Testing with calc().
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 calc(x) calc(y) calc(z))', 'color(xyz-d50 7 -20.5 100)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 calc(x) calc(y) calc(z) / calc(alpha))', 'color(xyz-d50 7 -20.5 100 / 0.4)'],

	// Testing with 'none'.
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 none none none)', 'color(xyz-d50 none none none)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 none none none / none)', 'color(xyz-d50 none none none / none)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y none)', 'color(xyz-d50 7 -20.5 none)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y none / alpha)', 'color(xyz-d50 7 -20.5 none)'],
	['color(from color(xyz-d50 7 -20.5 100) xyz-d50 x y z / none)', 'color(xyz-d50 7 -20.5 100 / none)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x y none / alpha)', 'color(xyz-d50 7 -20.5 none / 0.4)'],
	['color(from color(xyz-d50 7 -20.5 100 / 40%) xyz-d50 x y z / none)', 'color(xyz-d50 7 -20.5 100 / none)'],
	// FIXME: Clarify with spec editors if 'none' should pass through to the constants.
	['color(from color(xyz-d50 none none none) xyz-d50 x y z)', 'color(xyz-d50 0 0 0)'],
	['color(from color(xyz-d50 none none none / none) xyz-d50 x y z / alpha)', 'color(xyz-d50 0 0 0 / 0)'],
	['color(from color(xyz-d50 7 none 100) xyz-d50 x y z)', 'color(xyz-d50 7 0 100)'],
	['color(from color(xyz-d50 7 -20.5 100 / none) xyz-d50 x y z / alpha)', 'color(xyz-d50 7 -20.5 100 / 0)'],

	// Spec Examples

	// Example 14.
	['rgb(from indianred 255 g b)', 'rgb(255, 92, 92)'],

	// Example 18.
	['lch(from peru calc(l * 0.8) c h)', 'lch(49.80138 54.003296 63.680317)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		canonicalize(test[1]),
		`"${test[0]}" : ${test[1]}`,
	);
}
