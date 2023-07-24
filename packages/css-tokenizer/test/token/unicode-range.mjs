import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';

// Sanity check without the additional flag
{
	const t = tokenizer({
		css: 'U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F',
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['ident-token', 'U', 0, 0, { value: 'U' }],
			['delim-token', '+', 1, 1, { value: '+' }],
			['ident-token', 'A5', 2, 3, { value: 'A5' }],
			['comma-token', ',', 4, 4, undefined],
			['whitespace-token', ' ', 5, 5, undefined],
			['ident-token', 'U', 6, 6, { value: 'U' }],
			[
				'number-token',
				'+4E00',
				7,
				11,
				{ value: 4, signCharacter: '+', type: 'number' },
			],
			[
				'dimension-token',
				'-9FFF',
				12,
				16,
				{ value: -9, signCharacter: '-', type: 'integer', unit: 'FFF' },
			],
			['comma-token', ',', 17, 17, undefined],
			['whitespace-token', ' ', 18, 18, undefined],
			['ident-token', 'U', 19, 19, { value: 'U' }],
			[
				'number-token',
				'+30',
				20,
				22,
				{ value: 30, signCharacter: '+', type: 'integer' },
			],
			['delim-token', '?', 23, 23, { value: '?' }],
			['delim-token', '?', 24, 24, { value: '?' }],
			['comma-token', ',', 25, 25, undefined],
			['whitespace-token', ' ', 26, 26, undefined],
			['ident-token', 'U', 27, 27, { value: 'U' }],
			['delim-token', '+', 28, 28, { value: '+' }],
			['ident-token', 'FF00-FF9F', 29, 37, { value: 'FF00-FF9F' }],
		],
	);
}

{
	const t = tokenizer({
		css: 'U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'U+A5',
				0,
				3,
				{ startOfRange: 165, endOfRange: 165 },
			],
			['comma-token', ',', 4, 4, undefined],
			['whitespace-token', ' ', 5, 5, undefined],
			[
				'unicode-range-token',
				'U+4E00-9FFF',
				6,
				16,
				{ startOfRange: 19968, endOfRange: 40959 },
			],
			['comma-token', ',', 17, 17, undefined],
			['whitespace-token', ' ', 18, 18, undefined],
			[
				'unicode-range-token',
				'U+30??',
				19,
				24,
				{ startOfRange: 12288, endOfRange: 12543 },
			],
			['comma-token', ',', 25, 25, undefined],
			['whitespace-token', ' ', 26, 26, undefined],
			[
				'unicode-range-token',
				'U+FF00-FF9F',
				27,
				37,
				{ startOfRange: 65280, endOfRange: 65439 },
			],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+?',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+?',
				0,
				2,
				{ startOfRange: 0, endOfRange: 15 },
			],
		],
	);
}

{
	const t = tokenizer({
		css: 'u--',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[['ident-token', 'u--', 0, 2, { value: 'u--' }]],
	);
}

{
	const t = tokenizer({
		css: 'u++',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			['ident-token', 'u', 0, 0, { value: 'u' }],
			['delim-token', '+', 1, 1, { value: '+' }],
			['delim-token', '+', 2, 2, { value: '+' }],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+0',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+0',
				0,
				2,
				{ startOfRange: 0, endOfRange: 0 },
			],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+0-',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+0',
				0,
				2,
				{ startOfRange: 0, endOfRange: 0 },
			],
			['delim-token', '-', 3, 3, { value: '-' }],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+??????',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+??????',
				0,
				7,
				{ startOfRange: 0, endOfRange: 16777215 },
			],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+???????',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+??????',
				0,
				7,
				{ startOfRange: 0, endOfRange: 16777215 },
			],
			['delim-token', '?', 8, 8, { value: '?' }],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+??a?',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+??',
				0,
				3,
				{ startOfRange: 0, endOfRange: 255 },
			],
			['ident-token', 'a', 4, 4, { value: 'a' }],
			['delim-token', '?', 5, 5, { value: '?' }],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+000000-001???',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+000000-001',
				0,
				11,
				{ startOfRange: 0, endOfRange: 1 },
			],
			['delim-token', '?', 12, 12, { value: '?' }],
			['delim-token', '?', 13, 13, { value: '?' }],
			['delim-token', '?', 14, 14, { value: '?' }],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+000000-0000011',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+000000-000001',
				0,
				14,
				{ startOfRange: 0, endOfRange: 1 },
			],
			['number-token', '1', 15, 15, { value: 1, signCharacter: undefined, type: 'integer' }],
		],
	);
}

{
	const t = tokenizer({
		css: 'u+0000001-0000011',
		unicodeRangesAllowed: true,
	});

	assert.deepEqual(
		collectTokens(t).slice(0, -1),
		[
			[
				'unicode-range-token',
				'u+000000',
				0,
				7,
				{ startOfRange: 0, endOfRange: 0 },
			],
			[
				'number-token',
				'1',
				8,
				8,
				{ value: 1, signCharacter: undefined, type: 'integer' },
			],
			[
				'number-token',
				'-0000011',
				9,
				16,
				{ value: -11, signCharacter: '-', type: 'integer' },
			],
		],
	);
}

