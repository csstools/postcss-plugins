import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';
import { canonicalize } from '../util/canonical.mjs';

const tests = [
	['color-mix(in srgb, green 40%, color(srgb 0.8978862558205767 0.4885001647805462 0.9594359763905097))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(srgb-linear 0.7832360124544266 0.2035510416163499 0.9101924728483531))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(a98-rgb 0.8035122804301492 0.484896415622613 0.9440692746539695))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(prophoto-rgb 0.7596595159204217 0.4934889951894072 0.8985832663171222))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(display-p3 0.843565234 0.509345345 0.9342344435))', 'rgb(137, 126, 147)'],
	['color-mix(in srgb, green 40%, color(rec2020 0.7728366085950608 0.49153213847089583 0.9202627474826224))', 'rgb(137, 126, 147)'],
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
	['color-mix(in srgb-linear, green 40%, color(rec2020 0.7728366085950608 0.49153213847089583 0.9202627474826224))', 'rgb(182, 126, 195)'],
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
	['color-mix(in xyz-d50, green 40%, color(rec2020 0.7728366085950608 0.49153213847089583 0.9202627474826224))', 'rgb(182, 126, 195)'],
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
	['color-mix(in hsl, green 40%, color(rec2020 0.7728366085950608 0.49153213847089583 0.9202627474826224))', 'rgb(28, 88, 245)'],
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
	['color-mix(in oklch, green 40%, color(rec2020 0.7728366085950608 0.49153213847089583 0.9202627474826224))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(xyz-d50 0.5501693084815327 0.37536346388820246 0.6806345611398199))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(xyz-d65 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, color(xyz 0.5600582450343325 0.37782875858447507 0.904570025128693))', 'rgb(0, 148, 253)'],
	['color-mix(in oklch, green 40%, oklch(0.747 0.196 322.2))', 'rgb(0, 148, 254)'],
	['color-mix(in oklch, green 40%, hsl(292deg 85.71% 72.55%))', 'rgb(0, 148, 253)'],

	['color-mix(in srgb, color(xyz 1 none 0) 30%, rgb(none 255 128))', 'rgb(255, 255, 255)'],

	['color-mix(in oklab, #09232c, white 50%)', 'rgb(123, 137, 142)'],

	['color-mix(in hsl longer hue, hsl(90deg 50% 50%), hsl(0deg 50% 50%)', canonicalize('hsl(225deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(90deg 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(270deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(90deg 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(90deg 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(90deg 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(90deg 50% 50%)', canonicalize('hsl(270deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(none 50% 50%), hsl(90deg 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(none 50% 50%), hsl(90deg 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(none 50% 50%), hsl(90deg 50% 50%)', canonicalize('hsl(90deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(none 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(180deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(none 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(0deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(none 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(0deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(none 50% 50%), hsl(none 50% 50%)', canonicalize('hsl(0deg 50% 50%)')],
	['color-mix(in hsl, hsl(30deg 40% 80% / 25%) 0%, hsl(90deg none none / none))', canonicalize('hsl(90deg 40% 80% / 25%)')],
	['color-mix(in hwb, hwb(30deg 30% 40% / 25%) 0%, hwb(90deg none none / 0.5))', canonicalize('hwb(90deg 30% 40% / 0.5)')],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);
}
