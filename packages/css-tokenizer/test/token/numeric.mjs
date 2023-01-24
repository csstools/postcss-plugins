import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: '10px ',
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
			['whitespace-token', ' ', 4, 4, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '4.01 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '4.01', 0, 3, { value: 4.01, type: 'number' }],
			['whitespace-token', ' ', 4, 4, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '-456.8 ',
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
			['whitespace-token', ' ', 6, 6, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '0.0 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '0.0', 0, 2, { value: 0, type: 'number' }],
			['whitespace-token', ' ', 3, 3, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '+0.0 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '+0.0', 0, 3, { value: 0, type: 'number' }],
			['whitespace-token', ' ', 4, 4, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '-0.0 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '-0.0', 0, 3, { value: -0, type: 'number' }],
			['whitespace-token', ' ', 4, 4, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '.60 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '.60', 0, 2, { value: 0.6, type: 'number' }],
			['whitespace-token', ' ', 3, 3, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '10e3 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '10e3', 0, 3, { value: 10000, type: 'number' }],
			['whitespace-token', ' ', 4, 4, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '-3.4e-2 ',
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
			['whitespace-token', ' ', 7, 7, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '-3.4e2 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '-3.4e2', 0, 5, { value: -340, type: 'number' }],
			['whitespace-token', ' ', 6, 6, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '-3.4e+2 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'number-token',
				'-3.4e+2',
				0,
				6,
				{ value: -340, type: 'number' },
			],
			['whitespace-token', ' ', 7, 7, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '-3.4e ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'dimension-token',
				'-3.4e',
				0,
				4,
				{ value: -3.4, type: 'number', unit: 'e' },
			],
			['whitespace-token', ' ', 5, 5, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '-3.4ef ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'dimension-token',
				'-3.4ef',
				0,
				5,
				{ value: -3.4, type: 'number', unit: 'ef' },
			],
			['whitespace-token', ' ', 6, 6, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '1e2 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'number-token',
				'1e2',
				0,
				2,
				{ value: 100, type: 'number' },
			],
			['whitespace-token', ' ', 3, 3, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '12rem ',
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
			['whitespace-token', ' ', 5, 5, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '12.2rem ',
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
			['whitespace-token', ' ', 7, 7, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '13% ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['percentage-token', '13%', 0, 2, { value: 13 }],
			['whitespace-token', ' ', 3, 3, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '0.13% ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['percentage-token', '0.13%', 0, 4, { value: 0.13 }],
			['whitespace-token', ' ', 5, 5, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '14--foo ',
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
			['whitespace-token', ' ', 7, 7, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '12. ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '12', 0, 1, { value: 12, type: 'integer' }],
			['delim-token', '.', 2, 2, { value: '.' }],
			['whitespace-token', ' ', 3, 3, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '+-12.2 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['delim-token', '+', 0, 0, { value: '+' }],
			['number-token', '-12.2', 1, 5, { value: -12.2, type: 'number' }],
			['whitespace-token', ' ', 6, 6, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '12.1.1 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '12.1', 0, 3, { value: 12.1, type: 'number' }],
			['number-token', '.1', 4, 5, { value: 0.1, type: 'number' }],
			['whitespace-token', ' ', 6, 6, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: ':nth-last-child(n+3) ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[ 'colon-token', ':', 0, 0, undefined ],
			[
				'function-token',
				'nth-last-child(',
				1,
				15,
				{ value: 'nth-last-child' },
			],
			[ 'ident-token', 'n', 16, 16, { value: 'n' } ],
			[ 'number-token', '+3', 17, 18, { value: 3, type: 'integer' } ],
			[')-token', ')', 19, 19, undefined],
			['whitespace-token', ' ', 20, 20, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: ':nth-last-child( n + 3 ) ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['colon-token', ':', 0, 0, undefined],
			[
				'function-token',
				'nth-last-child(',
				1,
				15,
				{ value: 'nth-last-child' },
			],
			['whitespace-token', ' ', 16, 16, undefined],
			['ident-token', 'n', 17, 17, { value: 'n' }],
			['whitespace-token', ' ', 18, 18, undefined],
			['delim-token', '+', 19, 19, { value: '+' }],
			['whitespace-token', ' ', 20, 20, undefined],
			['number-token', '3', 21, 21, { value: 3, type: 'integer' }],
			['whitespace-token', ' ', 22, 22, undefined],
			[')-token', ')', 23, 23, undefined],
			['whitespace-token', ' ', 24, 24, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: `10\\1\\0
`,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'dimension-token',
				'10\\1\\0\n',
				0,
				6,
				{ value: 10, type: 'integer', unit: '\x01�' },
			],
		],
	);
}
