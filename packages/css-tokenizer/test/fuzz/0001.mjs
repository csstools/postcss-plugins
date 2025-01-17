import { tokenize, tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: `B{5"dP[qh}R
Q27Z6hB`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'B', 0, 0, { value: 'B' }],
			['{-token', '{', 1, 1, undefined],
			['number-token', '5', 2, 2, { value: 5, signCharacter: undefined, type: 'integer' }],
			['bad-string-token', '"dP[qh}R', 3, 10, undefined],
			['whitespace-token', '\n', 11, 11, undefined],
			['ident-token', 'Q27Z6hB', 12, 18, { value: 'Q27Z6hB' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '\\ ',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\\x00', 0, 1, { value: '�' }],
			['delim-token', '\b', 2, 2, { value: '\b' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '\\\rZ(',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['delim-token', '\\', 0, 0, { value: '\\' }],
			['whitespace-token', '\r', 1, 1, undefined],
			['function-token', 'Z(', 2, 3, { value: 'Z' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenize({
		css: 'Iv1 B}',
	});

	assert.deepEqual(
		t,
		[
			['ident-token', 'Iv1', 0, 2, { value: 'Iv1' }],
			['delim-token', '', 3, 3, { value: '' }],
			['ident-token', '\x00B', 4, 5, { value: '�B' }],
			['}-token', '}', 6, 6, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
