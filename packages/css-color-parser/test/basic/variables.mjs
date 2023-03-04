import { color } from '@csstools/css-color-parser';
import assert from 'assert';
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
				colorSpace: 'xyz-d50',
				channels: [0.5192047315068763, 0.3772407897198402, 0.03487991937645182],
				sourceColorSpace: 'srgb',
				missingComponents: [false, false, false, false],
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
				colorSpace: 'xyz-d50',
				channels: [0.5192047315068763, 0.3772407897198402, 0.03487991937645182],
				sourceColorSpace: 'srgb',
				missingComponents: [false, false, false, false],
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
