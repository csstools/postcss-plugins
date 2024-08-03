import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';

[
	'transparent',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorNotation: 'rgb',
			channels: [0, 0, 0],
			alpha: 0,
			syntaxFlags: new Set(['color-keyword']),
		},
	);
});

[
	'currentColor',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		false,
	);
});
