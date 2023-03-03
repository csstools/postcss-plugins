import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';

[
	'transparent',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorSpace: 'xyz-d50',
			channels: [0, 0, 0],
			sourceColorSpace: 'srgb',
			alpha: 0,
			missingComponents: [false, false, false, false],
			syntaxFlags: new Set(['color-keyword']),
		},
	);
});

[
	'currentColor',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		-1,
	);
});
