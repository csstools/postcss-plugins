import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';
import { canonicalize } from '../util/canonical.mjs';

const tests = [
	['color-mix(in srgb, green 40%, color(srgb 0.8978862558205767 0.4885001647805462 0.9594359763905097))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(srgb-linear 0.7832360124544266 0.2035510416163499 0.9101924728483531))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(a98-rgb 0.8035122804301492 0.484896415622613 0.9440692746539695))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(prophoto-rgb 0.7596595159204217 0.4934889951894072 0.8985832663171222))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(display-p3 0.843565234 0.509345345 0.9342344435))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(rec2020 0.807076644727751 0.5627572708703388 0.9326528689276063))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(xyz-d50 0.5501693084815327 0.37536346388820246 0.6806345611398199))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(xyz-d65 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(xyz 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, oklch(0.747 0.196 322.2))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, hsl(292deg 85.71% 72.55%))', 'rgb(137, 126, 147)'],

	['color-mix(in srgb-linear, green 40%, color(srgb 0.8978862558205767 0.4885001647805462 0.9594359763905097))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, color(srgb-linear 0.7832360124544266 0.2035510416163499 0.9101924728483531))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, color(a98-rgb 0.8035122804301492 0.484896415622613 0.9440692746539695))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, color(prophoto-rgb 0.7596595159204217 0.4934889951894072 0.8985832663171222))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, color(display-p3 0.843565234 0.509345345 0.9342344435))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, color(rec2020 0.807076644727751 0.5627572708703388 0.9326528689276063))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, color(xyz-d50 0.5501693084815327 0.37536346388820246 0.6806345611398199))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, color(xyz-d65 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, color(xyz 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, oklch(0.747 0.196 322.2))', 'rgb(182, 126, 195)'],
	['color-mix(in srgb-linear, green 40%, hsl(292deg 85.71% 72.55%))', 'rgb(182, 126, 195)'],

	['color-mix(in xyz-d50, green 40%, color(srgb 0.8978862558205767 0.4885001647805462 0.9594359763905097))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, color(srgb-linear 0.7832360124544266 0.2035510416163499 0.9101924728483531))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, color(a98-rgb 0.8035122804301492 0.484896415622613 0.9440692746539695))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, color(prophoto-rgb 0.7596595159204217 0.4934889951894072 0.8985832663171222))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, color(display-p3 0.843565234 0.509345345 0.9342344435))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, color(rec2020 0.807076644727751 0.5627572708703388 0.9326528689276063))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, color(xyz-d50 0.5501693084815327 0.37536346388820246 0.6806345611398199))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, color(xyz-d65 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, color(xyz 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, oklch(0.747 0.196 322.2))', 'rgb(182, 126, 195)'],
	['color-mix(in xyz-d50, green 40%, hsl(292deg 85.71% 72.55%))', 'rgb(182, 126, 195)'],

	['color-mix(in hsl, green 40%, color(srgb 0.8978862558205767 0.4885001647805462 0.9594359763905097))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, color(srgb-linear 0.7832360124544266 0.2035510416163499 0.9101924728483531))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, color(a98-rgb 0.8035122804301492 0.484896415622613 0.9440692746539695))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, color(prophoto-rgb 0.7596595159204217 0.4934889951894072 0.8985832663171222))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, color(display-p3 0.843565234 0.509345345 0.9342344435))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, color(rec2020 0.807076644727751 0.5627572708703388 0.9326528689276063))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, color(xyz-d50 0.5501693084815327 0.37536346388820246 0.6806345611398199))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, color(xyz-d65 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, color(xyz 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(28, 88, 245)'],
	['color-mix(in hsl, green 40%, oklch(0.747 0.196 322.2))', 'rgb(28, 89, 245)'],
	['color-mix(in hsl, green 40%, hsl(292deg 85.71% 72.55%))', 'rgb(28, 89, 245)'],

	['color-mix(in oklch, green 40%, color(srgb 0.8978862558205767 0.4885001647805462 0.9594359763905097))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(srgb-linear 0.7832360124544266 0.2035510416163499 0.9101924728483531))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(a98-rgb 0.8035122804301492 0.484896415622613 0.9440692746539695))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(prophoto-rgb 0.7596595159204217 0.4934889951894072 0.8985832663171222))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(display-p3 0.843565234 0.509345345 0.9342344435))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(rec2020 0.807076644727751 0.5627572708703388 0.9326528689276063))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(xyz-d50 0.5501693084815327 0.37536346388820246 0.6806345611398199))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(xyz-d65 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(xyz 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, oklch(0.747 0.196 322.2))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, hsl(292deg 85.71% 72.55%))', 'rgb(0, 148, 253)'],

	['color-mix(in srgb, color(xyz 1 none 0) 30%, rgb(none 255 128))', 'rgb(255, 255, 255)'],

	['color-mix(in oklab, #09232c, white 50%)', 'rgb(123, 137, 142)'],
	['color-mix(#09232c, white 50%)', 'rgb(123, 137, 142)'],
	['color-mix(in oklab, red, white 50%)', 'rgb(255, 168, 155)'],
	['color-mix(red, white 50%)', 'rgb(255, 168, 155)'],

	['color-mix(in hsl longer hue, hsl(90deg 50% 50%), hsl(0deg 50% 50%)', canonicalize('hsl(225deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(90deg 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(270deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(90deg 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(90deg 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(90deg 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(90deg 50% 50%)', canonicalize('hsl(270deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(none 50% 50%), hsl(90deg 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(none 50% 50%), hsl(90deg 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(none 50% 50%), hsl(90deg 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],

	['color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(none 50% 50%))', canonicalize('hsl(none 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(none 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(none 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(none 50% 50%), hsl(none 50% 50%))', canonicalize('hsl(none 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(none 50% 50%), hsl(none 50% 50%))', canonicalize('hsl(none 50% 50%)')],

	['color-mix(in hsl, color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(none 50% 50%)), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],
	['color-mix(in hsl, color-mix(in hsl shorter hue, hsl(none 50% 50%), hsl(none 50% 50%)), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],
	['color-mix(in hsl, color-mix(in hsl increasing hue, hsl(none 50% 50%), hsl(none 50% 50%)), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],
	['color-mix(in hsl, color-mix(in hsl decreasing hue, hsl(none 50% 50%), hsl(none 50% 50%)), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],

	['color-mix(in hsl longer hue, color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(none 50% 50%)), hsl(180deg 50% 50%))', canonicalize('hsl(0deg 50% 50%)')],
	['color-mix(in hsl shorter hue, color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(none 50% 50%)), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],
	['color-mix(in hsl increasing hue, color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(none 50% 50%)), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(none 50% 50%)), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],

	['color-mix(in hsl longer hue, hsl(180deg 50% 50%), hsl(180deg 50% 50%))', canonicalize('hsl(0deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(180deg 50% 50%), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(180deg 50% 50%), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(180deg 50% 50%), hsl(180deg 50% 50%))', canonicalize('hsl(180deg 50% 50%)')],

	['color-mix(in hsl, color-mix(in hsl longer hue, hsl(50deg 0% 50%), hsl(50deg 0% 50%)), hsl(180deg 100% 50%))', canonicalize('hsl(180deg 50% 50%)')],

	['color-mix(in hsl, hsl(30deg 40% 80% / 25%) 0%, hsl(90deg none none / none))', canonicalize('hsl(90deg 40% 80% / 25%)')],
	['color-mix(in hwb, hwb(30deg 30% 40% / 25%) 0%, hwb(90deg none none / 0.5))', canonicalize('hwb(90deg 30% 40% / 0.5)')],
	['color-mix(in hsl, hsl(from hsl(none 50% 50%) h s l), hsl(from hsl(120deg 50% 50%) h s l))', canonicalize('hsl(120deg 50% 50%)')],
	['color-mix(in hsl, hsl(from hsl(0deg 50% 50%) none s l), hsl(from hsl(120deg 50% 50%) h s l))', canonicalize('hsl(120deg 50% 50%)')],
	['color-mix(in hsl, hsl(from hsl(none 50% 50%) none s l), hsl(from hsl(120deg 50% 50%) h s l))', canonicalize('hsl(120deg 50% 50%)')],
	['color-mix(in srgb, rgb(from rebeccapurple none g b), rebeccapurple)', canonicalize('rebeccapurple')],
	['color-mix(in hsl, hsl(from rebeccapurple none s l), rebeccapurple)', canonicalize('rebeccapurple')],
	['color-mix(in hwb, hwb(from rebeccapurple none w b), rebeccapurple)', canonicalize('rebeccapurple')],
	['color-mix(in lab, lab(from lab(25 20 50) none a b), lab(25 20 50))', canonicalize('lab(25 20 50)')],
	['color-mix(in oklab, oklab(from oklab(0.25 0.2 0.5) none a b), oklab(0.25 0.2 0.5))', canonicalize('oklab(0.25 0.2 0.5)')],
	['color-mix(in lch, lch(from lch(0.7 45 30) l c none), lch(0.7 45 30))', canonicalize('lch(0.7 45 30)')],
	['color-mix(in oklch, oklch(from oklch(0.7 0.45 30) l c none), oklch(0.7 0.45 30))', canonicalize('oklch(0.7 0.45 30)')],
	['color-mix(in hsl, hsl(calc(NaN) 30% 40%), hsl(20deg 30% 40%))', canonicalize('hsl(10deg 30% 40%)')],
	['color-mix(in hsl, hsl(calc(0 / 0) 30% 40%), hsl(20deg 30% 40%))', canonicalize('hsl(10deg 30% 40%)')],

	// TODO : `none` containing support
	['color-mix(in hsl, hsl(calc(none) 30% 40%), hsl(20deg 30% 40%))', ''],

	// 0 percentage sum
	['color-mix(in hsl, hsl(120deg 10% 20%) 0%, hsl(30deg 30% 40%) 0%)', canonicalize('hsl(75.48deg 20.26% 30% / 0)')], // sum of percentages is 0
	['color-mix(in hwb, hwb(40deg 30% 40%) 0%, hwb(40deg 30% 40%) 0%)', canonicalize('hwb(40.26deg 30.2% 40% / 0%)')], // sum of percentages is 0
	['color-mix(in lch, lch(10 20 30deg) 0%, lch(10 20 30deg) 0%)', canonicalize('lch(10 19.96 29.26 / 0)')], // sum of percentages is 0

	['color-mix(in hsl, hsl(120deg 10% 20%))', canonicalize('hsl(120deg 10% 20%)')], // single arg
	['color-mix(in hsl, hsl(120deg 10% 20%) 100%)', canonicalize('hsl(120deg 10% 20%)')], // single arg
	['color-mix(in srgb, hsl(none 50% 50%))', canonicalize('rgb(191, 64, 64)')], // single arg
	['color-mix(in srgb, red 50%)', canonicalize('rgba(255, 0, 0, 0.5)')], // single arg
	['color-mix(in srgb, red 100%)', canonicalize('rgb(255, 0, 0)')], // single arg

	['color-mix(in hsl, hsl(120deg 10% 20%), hsl(120deg 10% 20%), hsl(120deg 10% 20%))', canonicalize('hsl(120deg 10% 20%)')], // multiple args
	['color-mix(in hsl, hsl(120deg 10% 20%) 30%, hsl(120deg 10% 20%) 30%, hsl(120deg 10% 20%) 40%)', canonicalize('hsl(120deg 10% 20%)')], // multiple args
	['color-mix(in srgb, red, lime, blue)', canonicalize('rgb(85, 85, 85)')], // multiple args
	['color-mix(in oklch, red, lime, blue)', canonicalize('rgb(0, 173, 49)')], // multiple args
	['color-mix(in oklch increasing hue, red, lime, blue)', canonicalize('rgb(0, 173, 49)')], // multiple args
	['color-mix(in oklch longer hue, red, lime, blue)', canonicalize('rgb(255, 50, 58)')], // multiple args
	['color-mix(in oklch decreasing hue, red, lime, blue)', canonicalize('rgb(86, 134, 255)')], // multiple args
	['color-mix(in xyz, red, lime, blue)', canonicalize('rgb(156, 156, 156)')], // multiple args
	['color-mix(in srgb, maroon, green, navy)', canonicalize('rgb(43, 43, 43)')], // multiple args
	['color-mix(in srgb, cyan, magenta, yellow)', canonicalize('rgb(170, 170, 170)')], // multiple args
	['color-mix(in srgb, red, lime, blue, maroon, green, navy, cyan, magenta, yellow)', canonicalize('rgb(99, 99, 99)')], // multiple args
	['color-mix(in srgb, cyan 50%, magenta 50%, yellow 50%)', canonicalize('rgb(170, 170, 170)')], // multiple args
	['color-mix(in srgb, cyan 25%, magenta 25%, yellow 25%)', canonicalize('rgba(170, 170, 170, 0.75)')], // multiple args

	['color-mix(in display-p3-linear, red, red)', canonicalize('red')],
	['color-mix(in display-p3-linear, color(display-p3-linear 0.3081 0.014 0.0567), color(display-p3-linear 0.3081 0.014 0.0567))', canonicalize('color(display-p3-linear 0.3081 0.014 0.0567)')],

	['color-mix(in oklab, red,)', ''],
	['color-mix(in oklab, red 5%,)', ''],
	['color-mix(in oklab, red, blue, green,)', ''],
	['color-mix(in oklab, red, , green)', ''],

	// Analogous sets
	['color-mix(in oklch, rgb(200, 100, 50), oklch(none none none))', 'rgb(200, 100, 50)'],
	['color-mix(in oklch, rgb(200, 100, 50), lab(none none none))', 'rgb(200, 100, 50)'],
	['color-mix(in oklch, lab(40% 20% 10%), lab(40% 20% 10%))', 'rgb(136, 77, 75)'],

	// non-unity alpha
	['color-mix(in srgb, rgb(100% 0% 0% / 0.7) 25%, rgb(0% 100% 0% / 0.2))', canonicalize('color(srgb 0.53846 0.46154 0 / 0.325)')],
	['color-mix(in srgb, rgb(100% 0% 0% / 0.7) 20%, rgb(0% 100% 0% / 0.2) 60%)', canonicalize('color(srgb 0.53846 0.46154 0 / 0.260)')],

	['color-mix(in srgb, red 0%, blue 0%, green 100%)', 'rgb(0, 128, 0)'],
	['color-mix(in srgb, green 100%, blue 0%, red 0%)', 'rgb(0, 128, 0)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);
}


assert.deepStrictEqual(
	color(parse('color-mix(in hsl, red 0%, blue 0%)')),
	{
		colorNotation: 'hsl',
		channels: [300, 100, 50],
		alpha: 0,
		syntaxFlags: new Set(['color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in hsl, red 0%)')),
	{
		colorNotation: 'hsl',
		channels: [360, 100, 50],
		alpha: 0,
		syntaxFlags: new Set(['color-keyword', 'named-color', 'color-mix-variadic', 'color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in hsl, red 0%, red 0%, red 0%)')),
	{
		colorNotation: 'hsl',
		channels: [360, 100, 50],
		alpha: 0,
		syntaxFlags: new Set(['color-mix', 'color-mix-variadic']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in lch, lch(100 0 40deg), lch(100 0 60deg))')),
	{
		colorNotation: 'lch',
		channels: [100, 0, Number.NaN],
		alpha: 1,
		syntaxFlags: new Set(['color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('oklch(from lch(100 0 0deg) l c h)')),
	{
		colorNotation: 'oklch',
		channels: [1, 4.996003610813204e-16, Number.NaN],
		alpha: 1,
		syntaxFlags: new Set(['relative-color-syntax', 'has-number-values']),
	},
);

assert.deepStrictEqual(
	color(parse('lch(from oklch(100 0 0deg) l c h)')),
	{
		colorNotation: 'lch',
		channels: [100, 1.1102230246251565e-13, Number.NaN],
		alpha: 1,
		syntaxFlags: new Set(['relative-color-syntax', 'has-number-values']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in oklch, lch(100 0 40deg), lch(100 0 60deg))')),
	{
		colorNotation: 'oklch',
		channels: [1.0000000000000002, 4.996003610813204e-16, Number.NaN],
		alpha: 1,
		syntaxFlags: new Set(['color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in lch, lch(none 20 none), lch(none 40 none))')),
	{
		colorNotation: 'lch',
		channels: [Number.NaN, 30, Number.NaN],
		alpha: 1,
		syntaxFlags: new Set(['color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in hsl, lch(50% 50% 30), hsl(50 50% 50%))')),
	{
		colorNotation: 'hsl',
		channels: [383.20260384, 60.179695615, 51.444468075],
		alpha: 1,
		syntaxFlags: new Set(['color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in hsl, lch(none 0 30), hsl(50 0 none))')),
	{
		colorNotation: 'hsl',
		channels: [Number.NaN, 0, Number.NaN],
		alpha: 1,
		syntaxFlags: new Set(['color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in lch, lch(none none none), lch(none none none))')),
	{
		colorNotation: 'lch',
		channels: [Number.NaN, Number.NaN, Number.NaN],
		alpha: 1,
		syntaxFlags: new Set(['color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in lch decreasing hue, lch(50% 50% -40deg), lch(50% 50% 40deg))')),
	{
		colorNotation: 'lch',
		channels: [50, 75, 180],
		alpha: 1,
		syntaxFlags: new Set(['color-mix']),
	},
);

assert.deepStrictEqual(
	color(parse('color-mix(in lch decreasing hue, lch(50% 50% 320deg), lch(50% 50% 40deg))')),
	{
		colorNotation: 'lch',
		channels: [50, 75, 180],
		alpha: 1,
		syntaxFlags: new Set(['color-mix']),
	},
);
