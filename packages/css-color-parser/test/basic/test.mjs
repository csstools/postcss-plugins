import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';

[
	'rgb( )',
	'rgb(calc(10% * 2) )',
	'rgb(calc(10% * 2), )',
	'rgb(calc(10% * 2), 0 )',
	'rgb(calc(10% * 2), 0, )',
	'rgb(calc(10% * 2), 0, foo(0))',
	'rgb(calc(10% * 2), 0, var(--foo))',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		-1,
	);
});

[
	'rgb(20%, 0, 0)',
	'rgb(calc(10% * 2), 0, 0)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			channels: [
				0.014435854625774971,
				0.007365585176701401,
				0.00046094760825903035,
			],
			alpha: 1,
			currentColorSpace: 'xyz-d50',
			sourceColorSpace: 'srgb',
		},
	);
});

[
	'rgb(20%, 0, 0, 50%)',
	'rgb(20%, 0, 0, 0.5)',
	'rgb(calc(10% * 2), 0, 0, 50%)',
	'rgb(20% 0 0 / 0.5)',
	'rgb(calc(10% * 2) 0 0 / 50%)',
	'rgb(calc(10% * 2)/**/0/**/ /**/0 / 50%)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			channels: [
				0.014435854625774971,
				0.007365585176701401,
				0.00046094760825903035,
			],
			alpha: 0.5,
			currentColorSpace: 'xyz-d50',
			sourceColorSpace: 'srgb',
		},
	);
});

