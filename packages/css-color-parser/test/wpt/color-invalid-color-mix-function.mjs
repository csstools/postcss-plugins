import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

{
	for (const colorSpace of ['lch', 'oklch']) {
		const tests = [
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30deg) -10%, ${colorSpace}(50% 60 70deg))`], // Percentages less than 0 are not valid.
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30deg) 150%, ${colorSpace}(50% 60 70deg))`], // Percentages greater than 100 are not valid.
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30deg / .4) -10%, ${colorSpace}(50% 60 70deg / .8))`], // Percentages less than 0 are not valid.
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30deg / .4) 150%, ${colorSpace}(50% 60 70deg / .8))`], // Percentages greater than 100 are not valid.
			[`color-mix(in ${colorSpace} hue, ${colorSpace}(10% 20 30deg), ${colorSpace}(50% 60 70deg))`], // `hue` keyword without a specified method.
			[`color-mix(in ${colorSpace} shorter, ${colorSpace}(10% 20 30deg), ${colorSpace}(50% 60 70deg))`], // Specified hue method without trailing `hue` keyword.
			[`color-mix(in ${colorSpace} foo, ${colorSpace}(10% 20 30deg), ${colorSpace}(50% 60 70deg))`], // Trailing identifier after color space that is not a hue method.
			[`color-mix(in ${colorSpace} ${colorSpace}(10% 20 30deg), ${colorSpace}(50% 60 70deg))`], // Missing comma after interpolation method.
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30deg) ${colorSpace}(50% 60 70deg))`], // Missing comma between colors.
			[`color-mix(${colorSpace}(10% 20 30deg), ${colorSpace}(50% 60 70deg), in ${colorSpace})`], // Interpolation method not at the beginning.
			[`color-mix(longer hue, ${colorSpace}(10% 20 30deg), ${colorSpace}(50% 60 70deg))`], // Missing interpolation method.
		];

		for (const test of tests) {
			assert.deepStrictEqual(
				serialize_sRGB_data(color(parse(test[0]))),
				'',
				test[0],
			);
		}
	}
}

{
	for (const colorSpace of ['lab', 'oklab']) {
		const tests = [
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30) -10%, ${colorSpace}(50% 60 70))`], // Percentages less than 0 are not valid.
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30) 150%, ${colorSpace}(50% 60 70))`], // Percentages greater than 100 are not valid.
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30 / .4) -10%, ${colorSpace}(50% 60 70 / .8))`], // Percentages less than 0 are not valid.
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30 / .4) 150%, ${colorSpace}(50% 60 70 / .8))`], // Percentages greater than 100 are not valid.
			[`color-mix(in ${colorSpace} longer hue, ${colorSpace}(10% 20 30), ${colorSpace}(50% 60 70))`], // Hue modifier on a non-polar color space.
			[`color-mix(in ${colorSpace} ${colorSpace}(10% 20 30), ${colorSpace}(50% 60 70))`], // Missing comma after interpolation method.
			[`color-mix(in ${colorSpace}, ${colorSpace}(10% 20 30) ${colorSpace}(50% 60 70))`], // Missing comma between colors.
			[`color-mix(${colorSpace}(10% 20 30), ${colorSpace}(50% 60 70), in ${colorSpace})`], // Interpolation method not at the beginning.
			[`color-mix(longer hue, ${colorSpace}(10% 20 30), ${colorSpace}(50% 60 70))`], // Missing interpolation method.
		];

		for (const test of tests) {
			assert.deepStrictEqual(
				serialize_sRGB_data(color(parse(test[0]))),
				'',
				test[0],
			);
		}
	}
}

{
	for (const colorSpace of ['srgb', 'srgb-linear', 'xyz', 'xyz-d50', 'xyz-d65']) {
		const tests = [
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3) -10%, color(${colorSpace} .5 .6 .7))`], // Percentages less than 0 are not valid.
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3) 150%, color(${colorSpace} .5 .6 .7))`], // Percentages greater than 100 are not valid.
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4) -10%, color(${colorSpace} .5 .6 .7 / .8))`], // Percentages less than 0 are not valid.
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4) 150%, color(${colorSpace} .5 .6 .7 / .8))`], // Percentages greater than 100 are not valid.
			[`color-mix(in ${colorSpace} longer hue, color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 .7))`], // Hue modifier on a non-polar color space.
			[`color-mix(in ${colorSpace} color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 .7))`], // Missing comma after interpolation method.
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3) color(${colorSpace} .5 .6 .7))`], // Missing comma between colors.
			[`color-mix(color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 .7), in ${colorSpace})`], // Interpolation method not at the beginning.
			[`color-mix(longer hue, color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 .7))`], // Missing interpolation method.
		];

		for (const test of tests) {
			assert.deepStrictEqual(
				serialize_sRGB_data(color(parse(test[0]))),
				'',
				test[0],
			);
		}
	}
}

{
	const tests = [
		['color-mix(in hsl, hsl(120deg 10% 20%) -10%, hsl(30deg 30% 40%))'], // Percentages less than 0 are not valid.
		['color-mix(in hsl, hsl(120deg 10% 20%) 150%, hsl(30deg 30% 40%))'], // Percentages greater than 100 are not valid.
		['color-mix(in hsl, hsl(120deg 10% 20% 40%) -10%, hsl(30deg 30% 40% 80%))'], // Percentages less than 0 are not valid.
		['color-mix(in hsl, hsl(120deg 10% 20% 40%) 150%, hsl(30deg 30% 40% 80%))'], // Percentages greater than 100 are not valid.
		['color-mix(in hsl hue, hsl(120deg 10% 20%), hsl(30deg 30% 40%))'], // `hue` keyword without a specified method.
		['color-mix(in hsl shorter, hsl(120deg 10% 20%), hsl(30deg 30% 40%))'], // Specified hue method without trailing `hue` keyword.
		['color-mix(in hsl foo, hsl(120deg 10% 20%), hsl(30deg 30% 40%))'], // Trailing identifier after color space that is not a hue method.
		['color-mix(in hsl hsl(120deg 10% 20%), hsl(30deg 30% 40%))'], // Missing comma after interpolation method.
		['color-mix(in hsl, hsl(120deg 10% 20%) hsl(30deg 30% 40%))'], // Missing comma between colors.
		['color-mix(hsl(120deg 10% 20%), hsl(30deg 30% 40%), in hsl)'], // Interpolation method not at the beginning.
		['color-mix(longer hue, hsl(120deg 10% 20%), hsl(30deg 30% 40%))'], // Missing interpolation method.

		['color-mix(in hwb, hwb(120deg 10% 20%) -10%, hwb(30deg 30% 40%))'], // Percentages less than 0 are not valid.
		['color-mix(in hwb, hwb(120deg 10% 20%) 150%, hwb(30deg 30% 40%))'], // Percentages greater than 100 are not valid.
		['color-mix(in hwb, hwb(120deg 10% 20% 40%) -10%, hwb(30deg 30% 40% 80%))'], // Percentages less than 0 are not valid.
		['color-mix(in hwb, hwb(120deg 10% 20% 40%) 150%, hwb(30deg 30% 40% 80%))'], // Percentages greater than 100 are not valid.
		['color-mix(in hwb hue, hwb(120deg 10% 20%), hwb(30deg 30% 40%))'], // `hue` keyword without a specified method.
		['color-mix(in hwb shorter, hwb(120deg 10% 20%), hwb(30deg 30% 40%))'], // Specified hue method without trailing `hue` keyword.
		['color-mix(in hwb foo, hwb(120deg 10% 20%), hwb(30deg 30% 40%))'], // Trailing identifier after color space that is not a hue method.
		['color-mix(in hwb hwb(120deg 10% 20%), hwb(30deg 30% 40%))'], // Missing comma after interpolation method.
		['color-mix(in hwb, hwb(120deg 10% 20%) hwb(30deg 30% 40%))'], // Missing comma between colors.
		['color-mix(hwb(120deg 10% 20%), hwb(30deg 30% 40%), in hwb)'], // Interpolation method not at the beginning.
		['color-mix(longer hue, hwb(120deg 10% 20%), hwb(30deg 30% 40%))'], // Missing interpolation method.
		['color-mix(in srgb, red, blue blue)'], // Too many parameters.
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			serialize_sRGB_data(color(parse(test[0]))),
			'',
		);
	}
}
