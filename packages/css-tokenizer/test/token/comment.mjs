import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: 'a /* a comment */ b',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'a', 0, 0, { value: 'a' }],
			['whitespace-token', ' ', 1, 1, undefined],
			['comment', '/* a comment */', 2, 16, undefined],
			['whitespace-token', ' ', 17, 17, undefined],
			['ident-token', 'b', 18, 18, { value: 'b' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'a/* a comment */b',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'a', 0, 0, { value: 'a' }],
			['comment', '/* a comment */', 1, 15, undefined],
			['ident-token', 'b', 16, 16, { value: 'b' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'a /* a comment',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'a', 0, 0, { value: 'a' }],
			['whitespace-token', ' ', 1, 1, undefined],
			['comment', '/* a comment', 2, 13, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: `a /* a comment
*/`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'a', 0, 0, { value: 'a' }],
			['whitespace-token', ' ', 1, 1, undefined],
			['comment', '/* a comment\n*/', 2, 16, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'a /* a comment \\*/ b',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'a', 0, 0, { value: 'a' }],
			['whitespace-token', ' ', 1, 1, undefined],
			['comment', '/* a comment \\*/', 2, 17, undefined],
			['whitespace-token', ' ', 18, 18, undefined],
			['ident-token', 'b', 19, 19, { value: 'b' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
