import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['contrast-color(black)', 'rgb(255, 255, 255)'],
	['contrast-color(#333)', 'rgb(255, 255, 255)'],
	['contrast-color(grey)', 'rgb(255, 255, 255)'],
	['contrast-color(#ccc)', 'rgb(0, 0, 0)'],
	['contrast-color(white)', 'rgb(0, 0, 0)'],
	['contrast-color(#1234b0)', 'rgb(255, 255, 255)'],
	['contrast-color(#b012a0)', 'rgb(255, 255, 255)'],

	['contrast-color(rgb(0 0 0))', 'rgb(255, 255, 255)'],
	['contrast-color(color(srgb 0 0 0))', 'rgb(255, 255, 255)'],
	['contrast-color(color(display-p3 0 0 0))', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(255 255 255))', 'rgb(0, 0, 0)'],
	['contrast-color(color(srgb 1 1 1))', 'rgb(0, 0, 0)'],
	['contrast-color(color(display-p3 1 1 1))', 'rgb(0, 0, 0)'],

	['contrast-color(rgb(0 0 0 / 0))', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(0 0 0 / 0.5))', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(255 255 255 / 0))', 'rgb(0, 0, 0)'],
	['contrast-color(rgb(255 255 255 / 0.5))', 'rgb(0, 0, 0)'],

	['contrast-color(contrast-color(#b012a0))', 'rgb(0, 0, 0)'],

	['contrast-color(hsl(45deg 30% 0%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% none))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 10%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 20%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 30%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 40%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 50%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 60%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(45deg 30% 70%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(45deg 30% 80%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(45deg 30% 90%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(45deg 30% 100%))', 'rgb(0, 0, 0)'],

	['contrast-color(hsl(260deg 30% 0%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% none))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 10%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 20%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 30%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 40%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 50%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 60%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 70%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 80%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(260deg 30% 90%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(260deg 30% 100%))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(none 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(10% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(20% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(30% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(40% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(50% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(60% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(70% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(80% 30% 90deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(90% 30% 90deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(100% 30% 90deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(none 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(10% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(20% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(30% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(40% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(50% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(60% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(70% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(80% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(90% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(100% 30% 300deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72.5% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72.55% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72.56% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(72.57% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(73% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(78% 30% 300deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 0deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 0deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 10deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 10deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 20deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 20deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 30deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 30deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 40deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 40deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 50deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 50deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 60deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 60deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(71% 30% 70deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72% 30% 70deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(71% 30% 80deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72% 30% 80deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(71% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72% 30% 90deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(71% 30% 100deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72% 30% 100deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(71% 30% 110deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72% 30% 110deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 120deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 120deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 130deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 130deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 140deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 140deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 150deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 150deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(69% 30% 160deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(70% 30% 160deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(69% 30% 170deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(70% 30% 170deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(69% 30% 180deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(70% 30% 180deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(69% 30% 190deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(70% 30% 190deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 200deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 200deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 210deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 210deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 220deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 220deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 230deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 230deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(70% 30% 240deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(71% 30% 240deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(71% 30% 250deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72% 30% 250deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(71% 30% 260deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72% 30% 260deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(71% 30% 270deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72% 30% 270deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 280deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 280deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 290deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 290deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 300deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 310deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 310deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 320deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 320deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 330deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 330deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 340deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 340deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 350deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 350deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 360deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(73% 30% 360deg))', 'rgb(0, 0, 0)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(
			color(
				parse(test[0]),
				{ flags: { experimentalContrastColorFunction: true } },
			),
		),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);
}

{
	[
		'contrast-color(black)',
		'color-mix(in srgb, contrast-color(black), contrast-color(white))',
		'rgb(from contrast-color(black) r g b)',
	].forEach((testCase) => {
		assert.ok(
			color(parse(testCase)).syntaxFlags.has('experimental'),
		);
	});
}
