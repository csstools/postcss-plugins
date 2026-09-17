import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: '<!--',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['CDO-token', '<!--', 0, 3, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '<!-',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['delim-token', '<', 0, 0, { value: '<' }],
			['delim-token', '!', 1, 1, { value: '!' }],
			['delim-token', '-', 2, 2, { value: '-' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '<!-\n',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['delim-token', '<', 0, 0, { value: '<' }],
			['delim-token', '!', 1, 1, { value: '!' }],
			['delim-token', '-', 2, 2, { value: '-' }],
			['whitespace-token', '\n', 3, 3, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	{
		const t = tokenizer({
			css: '<x--',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['delim-token', '<', 0, 0, { value: '<' }],
				['ident-token', 'x--', 1, 3, { value: 'x--' }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: '<!x-',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['delim-token', '<', 0, 0, { value: '<' }],
				['delim-token', '!', 1, 1, { value: '!' }],
				['ident-token', 'x-', 2, 3, { value: 'x-' }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}
}
