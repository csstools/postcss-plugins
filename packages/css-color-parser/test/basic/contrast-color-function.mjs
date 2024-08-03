import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['contrast-color( black max )', 'rgb(255, 255, 255)'],
	['contrast-color(#333/* */max/* */)', 'rgb(255, 255, 255)'],
	['contrast-color(grey max)', 'rgb(0, 0, 0)'],
	['contrast-color(#ccc max)', 'rgb(0, 0, 0)'],
	['contrast-color(white max)', 'rgb(0, 0, 0)'],
	['contrast-color(#1234b0 max)', 'rgb(255, 255, 255)'],
	['contrast-color(#b012a0 max)', 'rgb(255, 255, 255)'],

	['contrast-color(rgb(0 0 0) max)', 'rgb(255, 255, 255)'],
	['contrast-color(color(srgb 0 0 0) max)', 'rgb(255, 255, 255)'],
	['contrast-color(color(display-p3 0 0 0) max)', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(255 255 255) max)', 'rgb(0, 0, 0)'],
	['contrast-color(color(srgb 1 1 1) max)', 'rgb(0, 0, 0)'],
	['contrast-color(color(display-p3 1 1 1) max)', 'rgb(0, 0, 0)'],

	['contrast-color(rgb(0 0 0 / 0) max)', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(0 0 0 / 0.5) max)', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(255 255 255 / 0) max)', 'rgb(0, 0, 0)'],
	['contrast-color(rgb(255 255 255 / 0.5) max)', 'rgb(0, 0, 0)'],

	['contrast-color(contrast-color(#b012a0 max) max)', 'rgb(0, 0, 0)'],

	['contrast-color(#3b9595 max)', 'rgb(0, 0, 0)'],
	['contrast-color(contrast-color(contrast-color(#3b9595 max) max) max)', 'rgb(0, 0, 0)'],

	// ignore
	['contrast-color( black )', ''],
	['contrast-color( black min )', ''],
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
		'contrast-color(black max)',
		'color-mix(in srgb, contrast-color(black max), contrast-color(white max))',
		'rgb(from contrast-color(black max) r g b)',
	].forEach((testCase) => {
		assert.ok(
			color(parse(testCase)).syntaxFlags.has('experimental'),
		);
	});
}
