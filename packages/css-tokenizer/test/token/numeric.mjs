import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: '10px',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'dimension-token',
				'10px',
				0,
				3,
				{ value: 10, type: 'integer', unit: 'px' },
			],
		],
	);
}

{
	const t = tokenizer({
		css: '4.01',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[['number-token', '4.01', 0, 3, { value: 4.01, type: 'number' }]],
	);
}

{
	const t = tokenizer({
		css: '-456.8',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'number-token',
				'-456.8',
				0,
				5,
				{ value: -456.8, type: 'number' },
			],
		],
	);
}

{
	const t = tokenizer({
		css: '0.0',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[['number-token', '0.0', 0, 2, { value: 0, type: 'number' }]],
	);
}

{
	const t = tokenizer({
		css: '+0.0',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[['number-token', '+0.0', 0, 3, { value: 0, type: 'number' }]],
	);
}

{
	const t = tokenizer({
		css: '-0.0',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[['number-token', '-0.0', 0, 3, { value: 0, type: 'number' }]],
	);
}

{
	const t = tokenizer({
		css: '.60',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[['number-token', '.60', 0, 2, { value: 0.6, type: 'number' }]],
	);
}

{
	const t = tokenizer({
		css: '10e3',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[ 'number-token', '10e3', 0, 3, { value: 10000, type: 'number' } ],
		],
	);
}

{
	const t = tokenizer({
		css: '-3.4e-2',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'number-token',
				'-3.4e-2',
				0,
				6,
				{ value: -0.034, type: 'number' },
			],
		],
	);
}

{
	const t = tokenizer({
		css: '12rem',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'dimension-token',
				'12rem',
				0,
				4,
				{ value: 12, type: 'integer', unit: 'rem' },
			],
		],
	);
}

{
	const t = tokenizer({
		css: '12.2rem',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'dimension-token',
				'12.2rem',
				0,
				6,
				{ value: 12.2, type: 'number', unit: 'rem' },
			],
		],
	);
}

{
	const t = tokenizer({
		css: '13%',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[['percentage-token', '13%', 0, 2, { value: 13 }]],
	);
}

{
	const t = tokenizer({
		css: '0.13%',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[['percentage-token', '0.13%', 0, 4, { value: 0.13 }]],
	);
}

{
	const t = tokenizer({
		css: '14--foo',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'dimension-token',
				'14--foo',
				0,
				6,
				{ value: 14, type: 'integer', unit: '--foo' },
			],
		],
	);
}

{
	const t = tokenizer({
		css: '12.',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '12', 0, 1, { value: 12, type: 'integer' }],
			['delim-token', '.', 2, 2, { value: '.' }],
		],
	);
}

{
	const t = tokenizer({
		css: '+-12.2',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['delim-token', '+', 0, 0, { value: '+' }],
			['number-token', '-12.2', 1, 5, { value: -12.2, type: 'number' }],
		],
	);
}

{
	const t = tokenizer({
		css: '12.1.1',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '12.1', 0, 3, { value: 12.1, type: 'number' }],
			['number-token', '.1', 4, 5, { value: 0.1, type: 'number' }],
		],
	);
}
