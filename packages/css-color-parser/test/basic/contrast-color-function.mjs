import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['contrast-color(black)', 'rgb(255, 255, 255)'],
	['contrast-color(#333)', 'rgb(255, 255, 255)'],
	['contrast-color(grey)', 'rgb(0, 0, 0)'],
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
