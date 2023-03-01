import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';

assert.deepStrictEqual(
	color(parse('rgb(none none none / none)')),
	{
		channels: [0, 0, 0],
		alpha: 0,
		missingComponents: [true, true, true, true],
		currentColorSpace: 'xyz-d50',
		sourceColorSpace: 'srgb',
		syntaxFlags: new Set(['has-alpha', 'has-none-keywords']),
	},
);

assert.deepStrictEqual(
	color(parse('rgb(255 none none / none)')),
	{
		channels: [0.43606574282481125, 0.22249319175623722, 0.013923904500943501],
		alpha: 0,
		missingComponents: [false, true, true, true],
		currentColorSpace: 'xyz-d50',
		sourceColorSpace: 'srgb',
		syntaxFlags: new Set(['has-number-values', 'has-alpha', 'has-none-keywords']),
	},
);

assert.deepStrictEqual(
	color(parse('rgb(255 none none / 1)')),
	{
		channels: [0.43606574282481125, 0.22249319175623722, 0.013923904500943501],
		alpha: 1,
		missingComponents: [false, true, true, false],
		currentColorSpace: 'xyz-d50',
		sourceColorSpace: 'srgb',
		syntaxFlags: new Set(['has-number-values', 'has-alpha', 'has-none-keywords']),
	},
);
