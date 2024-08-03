import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';

// Legacy
{
	assert.deepStrictEqual(
		color(parse('rgb(var(--r), var(--g), var(--b), var(--a))')),
		false,
	);

	assert.deepStrictEqual(
		color(parse('rgb(255, var(--g), var(--b), var(--a))')),
		false,
	);

	assert.deepStrictEqual(
		color(parse('rgb(255, 128, var(--b), var(--a))')),
		false,
	);

	{
		const result = color(parse('rgb(255, 128, 0, var(--a))'));
		const alpha = result.alpha;
		delete result.alpha;

		assert.deepStrictEqual(
			result,
			{
				colorNotation: 'rgb',
				channels: [1, 0.5019607843137255, 0],
				syntaxFlags: new Set([
					'legacy-rgb',
					'has-variable-alpha',
					'has-alpha',
					'has-number-values',
				]),
			},
		);

		assert.deepStrictEqual(
			alpha.toString(),
			'var(--a)',
		);
	}
}

// Modern
{
	assert.deepStrictEqual(
		color(parse('rgb(var(--r) var(--g) var(--b) / var(--a))')),
		false,
	);

	assert.deepStrictEqual(
		color(parse('rgb(255 var(--g) var(--b) / var(--a))')),
		false,
	);

	assert.deepStrictEqual(
		color(parse('rgb(255 128 var(--b) / var(--a))')),
		false,
	);

	{
		const result = color(parse('rgb(255 128 0 / var(--a))'));
		const alpha = result.alpha;
		delete result.alpha;

		assert.deepStrictEqual(
			result,
			{
				colorNotation: 'rgb',
				channels: [1, 0.5019607843137255, 0],
				syntaxFlags: new Set([
					'has-variable-alpha',
					'has-alpha',
					'has-number-values',
				]),
			},
		);

		assert.deepStrictEqual(
			alpha.toString(),
			'var(--a)',
		);
	}
}

// Color Mix
{
	assert.deepStrictEqual(
		color(parse('color-mix(in hsl, hsl(120deg 10% 20% / var(--a)), hsl(30deg 30% 40%))')),
		false,
	);

	assert.deepStrictEqual(
		color(parse('color-mix(in hsl, hsl(120deg 10% 20%), hsl(30deg 30% 40% / var(--a)))')),
		false,
	);
}
