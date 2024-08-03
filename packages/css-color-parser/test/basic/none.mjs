import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';

assert.deepStrictEqual(
	color(parse('rgb(none none none / none)')),
	{
		colorNotation: 'rgb',
		channels: [NaN, NaN, NaN],
		alpha: NaN,
		syntaxFlags: new Set(['has-alpha', 'has-none-keywords']),
	},
);

assert.deepStrictEqual(
	color(parse('rgb(255 none none / none)')),
	{
		colorNotation: 'rgb',
		channels: [1, NaN, NaN],
		alpha: NaN,
		syntaxFlags: new Set(['has-number-values', 'has-alpha', 'has-none-keywords']),
	},
);

assert.deepStrictEqual(
	color(parse('rgb(255 none none / 1)')),
	{
		colorNotation: 'rgb',
		channels: [1, NaN, NaN],
		alpha: 1,
		syntaxFlags: new Set(['has-number-values', 'has-alpha', 'has-none-keywords']),
	},
);

assert.deepStrictEqual(
	color(parse('hsl(120deg 20% none)')),
	{
		colorNotation: 'hsl',
		channels: [120, 20, NaN],
		alpha: 1,
		syntaxFlags: new Set([
			'has-dimension-values',
			'has-percentage-values',
			'has-none-keywords',
		]),
	},
);
