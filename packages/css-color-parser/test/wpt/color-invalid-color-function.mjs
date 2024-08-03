import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

{
	for (const colorSpace of ['srgb', 'srgb-linear', 'a98-rgb', 'rec2020', 'prophoto-rgb']) {
		const tests = [
			[`color(${colorSpace} 0 0 0 0)`],
			[`color(${colorSpace} 0deg 0% 0)`],
			[`color(${colorSpace} 0% 0 0 1)`],
			[`color(${colorSpace} 0% 0 0 10%)`],
			[`color(${colorSpace} 0% 0 0deg)`],
			[`color(${colorSpace} 0% 0% 0deg)`],
			[`color(${colorSpace} 40% 0 0deg)`],
			// Missing parameters should not parse
			[`color(${colorSpace} 50% -200)`],
			[`color(${colorSpace} 50%)`],
			[`color(${colorSpace})`],
			[`color(${colorSpace} 50% -200 / 0.5)`],
			[`color(${colorSpace} 50% / 0.5)`],
			[`color(${colorSpace} / 0.5)`],
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
	for (const colorSpace of ['xyz', 'xyz-d50', 'xyz-d65']) {
		const tests = [
			[`color(${colorSpace} 0 0 0 0)`],
			[`color(${colorSpace} 0deg 0% 0)`],
			[`color(${colorSpace} 0% 0 0 1)`],
			[`color(${colorSpace} 0% 0 0 10%)`],
			[`color(${colorSpace} 0% 0 0deg)`],
			[`color(${colorSpace} 0% 0% 0deg)`],
			[`color(${colorSpace} 40% 0 0deg)`],
			// Missing parameters should not parse
			[`color(${colorSpace} 1 1)`],
			[`color(${colorSpace} 1)`],
			[`color(${colorSpace})`],
			[`color(${colorSpace} 1 1 / .5)`],
			[`color(${colorSpace} 1 / 0.5)`],
			[`color(${colorSpace} / 50%)`],
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
		['color()'],  // Empty
		['color(banana 1 1 1)'],  // Bad color space
		['color(displayp3 1 1 1)'],  // Bad Display P3 color space
		['color(1 1 1)'],  // No color space
		['color(srgb 1 1)'],  // One missing component
		['color(srgb 1)'],  // Two missing components

		['color(srgb 1 1 1 1)'],  // Too many parameters
		['color(srgb 1 1 1 1 1)'],  // Way too many parameters
		['color(srgb 1 eggs 1)'],  // Bad parameters
		['color(srgb 1 1 1 / bacon)'],  // Bad alpha
		['color(srgb 1 1 1 / 1 cucumber)'],  // Junk after alpha
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			serialize_sRGB_data(color(parse(test[0]))),
			'',
			test[0],
		);
	}
}
