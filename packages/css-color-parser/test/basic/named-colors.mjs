import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';

[
	'rebeccaPurple',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorSpace: 'xyz-d50',
			channels: [0.11626685348187807, 0.07260491448624555, 0.23253794900056146],
			sourceColorSpace: 'srgb',
			alpha: 1,
			missingComponents: [false, false, false, false],
			syntaxFlags: new Set(['color-keyword', 'named-color']),
		},
	);
});

[
	'hotPink',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorSpace: 'xyz-d50',
			channels: [0.5557760906778912, 0.35143055697884495, 0.35356074524226544],
			sourceColorSpace: 'srgb',
			alpha: 1,
			missingComponents: [false, false, false, false],
			syntaxFlags: new Set(['color-keyword', 'named-color']),
		},
	);
});

[
	'white',
].forEach((testCase) => {
	assert.deepStrictEqual(
		color(parse(testCase)),
		{
			colorSpace: 'xyz-d50',
			channels: [0.9642956660812443, 1.0000000361162844, 0.8251045485672053],
			sourceColorSpace: 'srgb',
			alpha: 1,
			missingComponents: [false, false, false, false],
			syntaxFlags: new Set(['color-keyword', 'named-color']),
		},
	);
});
