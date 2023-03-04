import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

[
	'rgb( )',
	'rgb(255 )',
	'rgb(255, )',
	'rgb(255, 0 )',
	'rgb(255, 0, )',
	'rgb(255, 0, foo(0))',
	'rgb(255, 0, var(--foo))',
	'rgb(255, 0, 0, )',
	'rgb(255, 0, 0, 0, )',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		false,
	);
});

[
	'rgb( )',
	'rgb(255 )',
	'rgb(255 0 )',
	'rgb(255 0 foo(0))',
	'rgb(255 0 var(--foo))',
	'rgb(255 0 0 / )',
	'rgb(255 0 0 / 0 0)',
	'rgb(255 0 0 / 0 / )',
	'rgb(255 0 0 / 0 / 0)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		false,
	);
});

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
		false,
	);
});

[
	'rgb(20%, 0%, 0%)',
	'rgb( 20%, 0%, 0%)',
	'rgb(/**/20%, 0%, 0%)',
	'rgb(calc(10% * 2), 0%, 0%)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorSpace: 'xyz-d50',
			channels: [
				0.014435854625774971,
				0.007365585176701401,
				0.00046094760825903035,
			],
			sourceColorSpace: 'srgb',
			alpha: 1,
			missingComponents: [false, false, false, false],
			syntaxFlags: new Set([ 'legacy-rgb', 'has-percentage-values' ]),
		},
		testCase,
	);
});

[
	'rgb(20% 0 0)',
	'rgb( 20% 0 0)',
	'rgb(/**/20% 0 0)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorSpace: 'xyz-d50',
			channels: [
				0.014435854625774971,
				0.007365585176701401,
				0.00046094760825903035,
			],
			sourceColorSpace: 'srgb',
			alpha: 1,
			missingComponents: [false, false, false, false],
			syntaxFlags: new Set(['has-number-values', 'has-percentage-values']),
		},
	);
});

[
	'rgb(20%, 0%, 0%, 0.5)',
	'rgb(calc(10% * 2), 0%, 0%, 0.5)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorSpace: 'xyz-d50',
			channels: [
				0.014435854625774971,
				0.007365585176701401,
				0.00046094760825903035,
			],
			sourceColorSpace: 'srgb',
			alpha: 0.5,
			missingComponents: [false, false, false, false],
			syntaxFlags: new Set(['legacy-rgb', 'has-alpha', 'has-percentage-values']),
		},
	);
});

[
	'rgb(20% 0 0 / 0.5)',
	'rgb(calc(10% * 2) 0 0 / 50%)',
	'rgb(calc(10% * 2)/**/0/**/ /**/0 / 50%)',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorSpace: 'xyz-d50',
			channels: [
				0.014435854625774971,
				0.007365585176701401,
				0.00046094760825903035,
			],
			sourceColorSpace: 'srgb',
			alpha: 0.5,
			missingComponents: [false, false, false, false],
			syntaxFlags: new Set(['has-number-values', 'has-percentage-values', 'has-alpha']),
		},
	);
});

// [
// 	'rgb(from pink calc((r + b) / 2) 0 0 / 1)',
// ].forEach((testCase) => {
// 	assert.deepStrictEqual(
// 		color(parse(testCase)),
// 		{
// 			channels: [0.3416739564730045, 0.1743318074545503, 0.010909904340504302],
// 			colorSpace: 'xyz-d50',
// 			sourceColorSpace: 'srgb',
// 			alpha: 1,
// 			missingComponents: [false, false, false, false],
// 			syntaxFlags: new Set(['relative-color-syntax']),
// 		},
// 	);
// });

// [
// 	'rgb(from pink calc((r + b) / 2) g b / alpha)',
// ].forEach((testCase) => {
// 	assert.deepStrictEqual(
// 		color(parse(testCase)),
// 		{
// 			channels: [0.630139848161484, 0.5884161176241673, 0.488544270929198],
// 			colorSpace: 'xyz-d50',
// 			sourceColorSpace: 'srgb',
// 			alpha: 1,
// 			missingComponents: [false, false, false, false],
// 			syntaxFlags: new Set(['relative-color-syntax']),
// 		},
// 	);
// });

// [
// 	'rgb(from pink calc((r + b) / 2) g b / alpha)',
// ].forEach((testCase) => {
// 	assert.deepStrictEqual(
// 		color(parse(testCase)),
// 		{
// 			channels: [0.630139848161484, 0.5884161176241673, 0.488544270929198],
// 			colorSpace: 'xyz-d50',
// 			sourceColorSpace: 'srgb',
// 			alpha: 1,
// 			missingComponents: [false, false, false, false],
// 			syntaxFlags: new Set(['relative-color-syntax']),
// 		},
// 	);
// });

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(20%, 40%, 60%, 80%)'))),
	'rgba(51, 102, 153, 0.8)',
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('rgb(51, 102, 153, 0.8)'))),
	'rgba(51, 102, 153, 0.8)',
);
