import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: '1.0',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['number-token', '1.0', 0, 2, { value: 1, signCharacter: undefined, type: 'number' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '.1',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['number-token', '.1', 0, 1, { value: 0.1, signCharacter: undefined, type: 'number' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '1.',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['number-token', '1', 0, 0, { value: 1, signCharacter: undefined, type: 'integer' }],
			['delim-token', '.', 1, 1, { value: '.' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '1.0px',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'dimension-token',
				'1.0px',
				0,
				4,
				{ value: 1, signCharacter: undefined, type: 'number', unit: 'px' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '.1px',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'dimension-token',
				'.1px',
				0,
				3,
				{ value: 0.1, signCharacter: undefined, type: 'number', unit: 'px' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '1.px',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['number-token', '1', 0, 0, { value: 1, signCharacter: undefined, type: 'integer' }],
			['delim-token', '.', 1, 1, { value: '.' }],
			['ident-token', 'px', 2, 3, { value: 'px' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
