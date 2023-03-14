import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

function canonicalize(x) {
	return serialize_sRGB_data(color(parse(x)));
}

const tests = [
	['color-mix(in hsl, hsl(120deg 10% 20%), hsl(30deg 30% 40%))', 'rgb(84, 92, 61)'],
	['color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40%))', 'rgb(112, 106, 67)'],
	['color-mix(in hsl, 25% hsl(120deg 10% 20%), hsl(30deg 30% 40%))', 'rgb(112, 106, 67)'],
	['color-mix(in hsl, hsl(120deg 10% 20%), 25% hsl(30deg 30% 40%))', 'rgb(61, 73, 54)'],
	['color-mix(in hsl, hsl(120deg 10% 20%), hsl(30deg 30% 40%) 25%)', 'rgb(61, 73, 54)'],
	['color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40%) 75%)', 'rgb(112, 106, 67)'],
	['color-mix(in hsl, hsl(120deg 10% 20%) 30%, hsl(30deg 30% 40%) 90%)', 'rgb(112, 106, 67)'], // Scale down > 100% sum.
	['color-mix(in hsl, hsl(120deg 10% 20%) 12.5%, hsl(30deg 30% 40%) 37.5%)', 'rgba(112, 106, 67, 0.5)'], // Scale up < 100% sum, causes alpha multiplication.
	['color-mix(in hsl, hsl(120deg 10% 20%) 0%, hsl(30deg 30% 40%))', 'rgb(133, 102, 71)'],

	['color-mix(in hsl, hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8))', 'rgba(95, 105, 65, 0.6)'],
	['color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40% / .8))', 'rgba(108, 103, 66, 0.85)'],
	['color-mix(in hsl, 25% hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8))', 'rgba(120, 114, 69, 0.7)'],
	['color-mix(in hsl, hsl(120deg 10% 20% / .4), 25% hsl(30deg 30% 40% / .8))', 'rgba(68, 84, 59, 0.5)'],
	['color-mix(in hsl, hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8) 25%)', 'rgba(68, 84, 59, 0.5)'],
	['color-mix(in hsl, hsl(120deg 10% 20% / .4) 25%, hsl(30deg 30% 40% / .8) 75%)', 'rgba(120, 114, 69, 0.7)'],
	['color-mix(in hsl, hsl(120deg 10% 20% / .4) 30%, hsl(30deg 30% 40% / .8) 90%)', 'rgba(120, 114, 69, 0.7)'], // Scale down > 100% sum.
	['color-mix(in hsl, hsl(120deg 10% 20% / .4) 12.5%, hsl(30deg 30% 40% / .8) 37.5%)', 'rgba(120, 114, 69, 0.35)'], // Scale up < 100% sum, causes alpha multiplication.
	['color-mix(in hsl, hsl(120deg 10% 20% / .4) 0%, hsl(30deg 30% 40% / .8))', 'rgba(133, 102, 71, 0.8)'],

	['color-mix(in hsl, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
	['color-mix(in hsl, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
	['color-mix(in hsl, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
	['color-mix(in hsl, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
	['color-mix(in hsl, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],
	['color-mix(in hsl, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],

	['color-mix(in hsl shorter hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],
	['color-mix(in hsl shorter hue, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],

	['color-mix(in hsl longer hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(230deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(230deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(190deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(190deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(170deg 50% 50%)')],
	['color-mix(in hsl longer hue, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(170deg 50% 50%)')],

	['color-mix(in hsl increasing hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(230deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(190deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(170deg 50% 50%)')],
	['color-mix(in hsl increasing hue, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],

	['color-mix(in hsl decreasing hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(230deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(190deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],
	['color-mix(in hsl decreasing hue, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(170deg 50% 50%)')],

	['color-mix(in hsl, hsl(none none none), hsl(none none none))', canonicalize('hsl(none none none)')],
	['color-mix(in hsl, hsl(none none none), hsl(30deg 40% 80%))', canonicalize('hsl(30deg 40% 80%)')],
	['color-mix(in hsl, hsl(120deg 20% 40%), hsl(none none none))', canonicalize('hsl(120deg 20% 40%)')],
	['color-mix(in hsl, hsl(120deg 20% none), hsl(30deg 40% 60%))', canonicalize('hsl(75deg 30% 60%)')],
	['color-mix(in hsl, hsl(120deg 20% 40%), hsl(30deg 20% none))', canonicalize('hsl(75deg 20% 40%)')],
	['color-mix(in hsl, hsl(none 20% 40%), hsl(30deg none 80%))', canonicalize('hsl(30deg 20% 60%)')],

	['color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40%))', canonicalize('hsl(60deg 40% 40%)')],
	['color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40% / 0.5))', canonicalize('hsl(60deg 40% 40% / 0.5)')],
	['color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40% / none))', canonicalize('hsl(60deg 40% 40% / none)')],

	['color-mix(in hwb, hwb(120deg 10% 20%), hwb(30deg 30% 40%))', 'rgb(147, 179, 51)'],
	['color-mix(in hwb, hwb(120deg 10% 20%) 25%, hwb(30deg 30% 40%))', 'rgb(166, 153, 64)'],
	['color-mix(in hwb, 25% hwb(120deg 10% 20%), hwb(30deg 30% 40%))', 'rgb(166, 153, 64)'],
	['color-mix(in hwb, hwb(120deg 10% 20%), 25% hwb(30deg 30% 40%))', 'rgb(96, 191, 38)'],
	['color-mix(in hwb, hwb(120deg 10% 20%), hwb(30deg 30% 40%) 25%)', 'rgb(96, 191, 38)'],
	['color-mix(in hwb, hwb(120deg 10% 20%) 25%, hwb(30deg 30% 40%) 75%)', 'rgb(166, 153, 64)'],
	['color-mix(in hwb, hwb(120deg 10% 20%) 30%, hwb(30deg 30% 40%) 90%)', 'rgb(166, 153, 64)'], // Scale down > 100% sum.
	['color-mix(in hwb, hwb(120deg 10% 20%) 12.5%, hwb(30deg 30% 40%) 37.5%)', 'rgba(166, 153, 64, 0.5)'], // Scale up < 100% sum, causes alpha multiplication.
	['color-mix(in hwb, hwb(120deg 10% 20%) 0%, hwb(30deg 30% 40%))', 'rgb(153, 115, 77)'],

	['color-mix(in hwb, hwb(120deg 10% 20% / .4), hwb(30deg 30% 40% / .8))', 'rgba(142, 170, 59, 0.6)'],
	['color-mix(in hwb, hwb(120deg 10% 20% / .4) 25%, hwb(30deg 30% 40% / .8))', 'rgba(160, 149, 69, 0.7)'],
	['color-mix(in hwb, 25% hwb(120deg 10% 20% / .4), hwb(30deg 30% 40% / .8))', 'rgba(160, 149, 69, 0.7)'],
	['color-mix(in hwb, hwb(120deg 10% 20%), 25% hwb(30deg 30% 40% / .8))', 'rgba(95, 193, 36, 0.95)'],
	['color-mix(in hwb, hwb(120deg 10% 20% / .4), hwb(30deg 30% 40% / .8) 25%)', 'rgba(98, 184, 46, 0.5)'],
	['color-mix(in hwb, hwb(120deg 10% 20% / .4) 25%, hwb(30deg 30% 40% / .8) 75%)', 'rgba(160, 149, 69, 0.7)'],
	['color-mix(in hwb, hwb(120deg 10% 20% / .4) 30%, hwb(30deg 30% 40% / .8) 90%)', 'rgba(160, 149, 69, 0.7)'], // Scale down > 100% sum.
	['color-mix(in hwb, hwb(120deg 10% 20% / .4) 12.5%, hwb(30deg 30% 40% / .8) 37.5%)', 'rgba(160, 149, 69, 0.35)'], // Scale up < 100% sum, causes alpha multiplication.
	['color-mix(in hwb, hwb(120deg 10% 20% / .4) 0%, hwb(30deg 30% 40% / .8))', 'rgba(153, 115, 77, 0.8)'],

	['color-mix(in hwb, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
	['color-mix(in hwb, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
	['color-mix(in hwb, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
	['color-mix(in hwb, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
	['color-mix(in hwb, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],
	['color-mix(in hwb, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],

	['color-mix(in hwb shorter hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
	['color-mix(in hwb shorter hue, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
	['color-mix(in hwb shorter hue, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
	['color-mix(in hwb shorter hue, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
	['color-mix(in hwb shorter hue, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],
	['color-mix(in hwb shorter hue, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],

	['color-mix(in hwb longer hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(230deg 30% 40%)')],
	['color-mix(in hwb longer hue, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(230deg 30% 40%)')],
	['color-mix(in hwb longer hue, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(190deg 30% 40%)')],
	['color-mix(in hwb longer hue, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(190deg 30% 40%)')],
	['color-mix(in hwb longer hue, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(170deg 30% 40%)')],
	['color-mix(in hwb longer hue, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(170deg 30% 40%)')],

	['color-mix(in hwb increasing hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
	['color-mix(in hwb increasing hue, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(230deg 30% 40%)')],
	['color-mix(in hwb increasing hue, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(190deg 30% 40%)')],
	['color-mix(in hwb increasing hue, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
	['color-mix(in hwb increasing hue, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(170deg 30% 40%)')],
	['color-mix(in hwb increasing hue, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],

	['color-mix(in hwb decreasing hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(230deg 30% 40%)')],
	['color-mix(in hwb decreasing hue, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
	['color-mix(in hwb decreasing hue, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
	['color-mix(in hwb decreasing hue, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(190deg 30% 40%)')],
	['color-mix(in hwb decreasing hue, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],
	['color-mix(in hwb decreasing hue, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(170deg 30% 40%)')],

	['color-mix(in hwb, hwb(none none none), hwb(none none none))', canonicalize('hwb(none none none)')],
	['color-mix(in hwb, hwb(none none none), hwb(30deg 30% 40%))', canonicalize('hwb(30deg 30% 40%)')],
	['color-mix(in hwb, hwb(120deg 10% 20%), hwb(none none none))', canonicalize('hwb(120deg 10% 20%)')],
	['color-mix(in hwb, hwb(120deg 10% none), hwb(30deg 30% 40%))', canonicalize('hwb(75deg 20% 40%)')],
	['color-mix(in hwb, hwb(120deg 10% 20%), hwb(30deg 30% none))', canonicalize('hwb(75deg 20% 20%)')],
	['color-mix(in hwb, hwb(none 10% 20%), hwb(30deg none 40%))', canonicalize('hwb(30deg 10% 30%)')],
	['color-mix(in hwb, hwb(120deg 10% 20% / none), hwb(30deg 30% 40%))', canonicalize('hwb(75deg 20% 30%)')],
	['color-mix(in hwb, hwb(120deg 10% 20% / none), hwb(30deg 30% 40% / 0.5))', canonicalize('hwb(75deg 20% 30% / 0.5)')],
	['color-mix(in hwb, hwb(120deg 10% 20% / none), hwb(30deg 30% 40% / none))', canonicalize('hwb(75deg 20% 30% / none)')],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);
}
