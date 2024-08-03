import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	for (let i = 0; i < 9; i++) {
		const t = tokenizer({
			css: i.toString(),
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['number-token', i.toString(), 0, 0, { value: i, signCharacter: undefined, type: 'integer' }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	for (let i = 10; i < 21; i++) {
		const t = tokenizer({
			css: i.toString(),
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['number-token', i.toString(), 0, 1, { value: i, signCharacter: undefined, type: 'integer' }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}
}

{
	for (let i = 1; i <= 8; i++) {
		const t = tokenizer({
			css: 'foo' + String.fromCodePoint(i),
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['ident-token', 'foo', 0, 2, { value: 'foo' }],
				['delim-token', String.fromCodePoint(i), 3, 3, { value: String.fromCodePoint(i) }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}
}

{
	for (let i = 0xe; i <= 0x1f; i++) {
		const t = tokenizer({
			css: 'foo' + String.fromCodePoint(i),
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['ident-token', 'foo', 0, 2, { value: 'foo' }],
				['delim-token', String.fromCodePoint(i), 3, 3, { value: String.fromCodePoint(i) }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}
}

{
	const t = tokenizer({
		css: 'foo' + String.fromCodePoint(0xb),
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'foo', 0, 2, { value: 'foo' }],
			['delim-token', String.fromCodePoint(0xb), 3, 3, { value: String.fromCodePoint(0xb) }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'foo' + String.fromCodePoint(0x7f),
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'foo', 0, 2, { value: 'foo' }],
			['delim-token', String.fromCodePoint(0x7f), 3, 3, { value: String.fromCodePoint(0x7f) }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
