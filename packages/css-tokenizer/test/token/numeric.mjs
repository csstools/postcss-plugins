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
				{ value: 10, signCharacter: undefined, type: 'integer', unit: 'px' },
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
			['number-token', '4.01', 0, 3, { value: 4.01, signCharacter: undefined, type: 'number' }],
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
				{ value: -456.8, signCharacter: '-', type: 'number' },
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
			['number-token', '0.0', 0, 2, { value: 0, signCharacter: undefined, type: 'number' }],
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
			['number-token', '+0.0', 0, 3, { value: 0, signCharacter: '+', type: 'number' }],
			['whitespace-token', ' ', 4, 4, undefined],
		],
	);
}

{
	{
		const t = tokenizer({
			css: '-0.0 ',
		});

		assert.deepEqual(
			collectTokens(t).slice(0, -1),
			[
				['number-token', '-0.0', 0, 3, { value: 0, signCharacter: '-', type: 'number' }],
				['whitespace-token', ' ', 4, 4, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: '-0.0 ',
		});

		assert.ok(Object.is(0, collectTokens(t)[0][4].value));
	}

	{
		const t = tokenizer({
			css: '-0 ',
		});

		assert.ok(Object.is(0, collectTokens(t)[0][4].value));
	}

	{
		const t = tokenizer({
			css: '+0.0 ',
		});

		assert.deepEqual(
			collectTokens(t).slice(0, -1),
			[
				['number-token', '+0.0', 0, 3, { value: 0, signCharacter: '+', type: 'number' }],
				['whitespace-token', ' ', 4, 4, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: '0.0 ',
		});

		assert.ok(Object.is(0, collectTokens(t)[0][4].value));
	}

	{
		const t = tokenizer({
			css: '0.0 ',
		});

		assert.deepEqual(
			collectTokens(t).slice(0, -1),
			[
				['number-token', '0.0', 0, 2, { value: 0, signCharacter: undefined, type: 'number' }],
				['whitespace-token', ' ', 3, 3, undefined],
			],
		);
	}
}

{
	const t = tokenizer({
		css: '.60 ',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['number-token', '.60', 0, 2, { value: 0.6, signCharacter: undefined, type: 'number' }],
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
			['number-token', '10e3', 0, 3, { value: 10000, signCharacter: undefined, type: 'number' }],
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
				{ value: -0.034, signCharacter: '-', type: 'number' },
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
			['number-token', '-3.4e2', 0, 5, { value: -340, signCharacter: '-', type: 'number' }],
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
				{ value: -340, signCharacter: '-', type: 'number' },
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
				{ value: -3.4, signCharacter: '-', type: 'number', unit: 'e' },
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
				{ value: -3.4, signCharacter: '-', type: 'number', unit: 'ef' },
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
				{ value: 100, signCharacter: undefined, type: 'number' },
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
				{ value: 12, signCharacter: undefined, type: 'integer', unit: 'rem' },
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
				{ value: 12.2, signCharacter: undefined, type: 'number', unit: 'rem' },
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
			['percentage-token', '13%', 0, 2, { value: 13, signCharacter: undefined }],
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
			['percentage-token', '0.13%', 0, 4, { value: 0.13, signCharacter: undefined }],
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
				{ value: 14, signCharacter: undefined, type: 'integer', unit: '--foo' },
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
			['number-token', '12', 0, 1, { value: 12, signCharacter: undefined, type: 'integer' }],
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
			['number-token', '-12.2', 1, 5, { value: -12.2, signCharacter: '-', type: 'number' }],
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
			['number-token', '12.1', 0, 3, { value: 12.1, signCharacter: undefined, type: 'number' }],
			['number-token', '.1', 4, 5, { value: 0.1, signCharacter: undefined, type: 'number' }],
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
			['number-token', '+3', 17, 18, { value: 3, signCharacter: '+', type: 'integer' } ],
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
			[
				'number-token',
				'3',
				21,
				21,
				{ value: 3, signCharacter: undefined, type: 'integer' },
			],
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
				{ value: 10, signCharacter: undefined, type: 'integer', unit: '\x01�' },
			],
		],
	);
}

{
	const t = tokenizer({
		css: 'calc(-infinity * 1px)',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['function-token', 'calc(', 0, 4, { value: 'calc' }],
			['ident-token', '-infinity', 5, 13, { value: '-infinity' }],
			['whitespace-token', ' ', 14, 14, undefined],
			['delim-token', '*', 15, 15, { value: '*' }],
			['whitespace-token', ' ', 16, 16, undefined],
			[
				'dimension-token',
				'1px',
				17,
				19,
				{ value: 1, signCharacter: undefined, type: 'integer', unit: 'px' },
			],
			[')-token', ')', 20, 20, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '+1_2.3_4e+5_6',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'number-token',
				'+1_2.3_4e+5_6',
				0,
				12,
				{ value: 1.234e+57, signCharacter: '+', type: 'number' },
			],
		],
	);
}
