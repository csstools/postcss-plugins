import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';

assert.deepStrictEqual(
	color(parse('rebeccaPurple')),
	{
		colorNotation: 'rgb',
		channels: [0.4, 0.2, 0.6],
		alpha: 1,
		syntaxFlags: new Set(['color-keyword', 'named-color']),
	},
);

assert.deepStrictEqual(
	color(parse('hotPink')),
	{
		colorNotation: 'rgb',
		channels: [1, 0.4117647058823529, 0.7058823529411765],
		alpha: 1,
		syntaxFlags: new Set(['color-keyword', 'named-color']),
	},
);

assert.deepStrictEqual(
	color(parse('white')),
	{
		colorNotation: 'rgb',
		channels: [1, 1, 1],
		alpha: 1,
		syntaxFlags: new Set(['color-keyword', 'named-color']),
	},
);
