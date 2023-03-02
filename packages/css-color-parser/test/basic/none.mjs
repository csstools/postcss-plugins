import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';

assert.deepStrictEqual(
	color(parse('rgb(none none none / none)')),
	{
		colorSpace: 'xyz-d50',
		channels: [0, 0, 0],
		sourceColorSpace: 'srgb',
		alpha: 0,
		missingComponents: [true, true, true, true],
		syntaxFlags: new Set(['has-alpha', 'has-none-keywords']),
	},
);

assert.deepStrictEqual(
	color(parse('rgb(255 none none / none)')),
	{
		colorSpace: 'xyz-d50',
		channels: [0.43606574282481125, 0.22249319175623722, 0.013923904500943501],
		sourceColorSpace: 'srgb',
		alpha: 0,
		missingComponents: [false, true, true, true],
		syntaxFlags: new Set(['has-number-values', 'has-alpha', 'has-none-keywords']),
	},
);

assert.deepStrictEqual(
	color(parse('rgb(255 none none / 1)')),
	{
		colorSpace: 'xyz-d50',
		channels: [0.43606574282481125, 0.22249319175623722, 0.013923904500943501],
		sourceColorSpace: 'srgb',
		alpha: 1,
		missingComponents: [false, true, true, false],
		syntaxFlags: new Set(['has-number-values', 'has-alpha', 'has-none-keywords']),
	},
);
