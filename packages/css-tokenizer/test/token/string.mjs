import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: `"fo
o"`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['bad-string-token', '"fo', 0, 2, undefined],
			['whitespace-token', '\n', 3, 3, undefined],
			['ident-token', 'o', 4, 4, { value: 'o' }],
			['string-token', '"', 5, 5, { value: '' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: `
.foo {
	image: url(();
}

.foo {
	content: "foo
bar";
}

#1 {}
`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['whitespace-token', '\n', 0, 0, undefined],
			['delim-token', '.', 1, 1, { value: '.' }],
			['ident-token', 'foo', 2, 4, { value: 'foo' }],
			['whitespace-token', ' ', 5, 5, undefined],
			['{-token', '{', 6, 6, undefined],
			['whitespace-token', '\n\t', 7, 8, undefined],
			['ident-token', 'image', 9, 13, { value: 'image' }],
			['colon-token', ':', 14, 14, undefined],
			['whitespace-token', ' ', 15, 15, undefined],
			['bad-url-token', 'url(()', 16, 21, undefined],
			['semicolon-token', ';', 22, 22, undefined],
			['whitespace-token', '\n', 23, 23, undefined],
			['}-token', '}', 24, 24, undefined],
			['whitespace-token', '\n\n', 25, 26, undefined],
			['delim-token', '.', 27, 27, { value: '.' }],
			['ident-token', 'foo', 28, 30, { value: 'foo' }],
			['whitespace-token', ' ', 31, 31, undefined],
			['{-token', '{', 32, 32, undefined],
			['whitespace-token', '\n\t', 33, 34, undefined],
			['ident-token', 'content', 35, 41, { value: 'content' }],
			['colon-token', ':', 42, 42, undefined],
			['whitespace-token', ' ', 43, 43, undefined],
			['bad-string-token', '"foo', 44, 47, undefined],
			['whitespace-token', '\n', 48, 48, undefined],
			['ident-token', 'bar', 49, 51, { value: 'bar' }],
			['bad-string-token', '";', 52, 53, undefined],
			['whitespace-token', '\n', 54, 54, undefined],
			['}-token', '}', 55, 55, undefined],
			['whitespace-token', '\n\n', 56, 57, undefined],
			[
				'hash-token',
				'#1',
				58,
				59,
				{ value: '1', type: 'unrestricted' },
			],
			['whitespace-token', ' ', 60, 60, undefined],
			['{-token', '{', 61, 61, undefined],
			['}-token', '}', 62, 62, undefined],
			['whitespace-token', '\n', 63, 63, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '\'one\\\r\ntwo\'',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['string-token', '\'one\\\r\ntwo\'', 0, 10, { value: 'onetwo' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '\'one\\\ntwo\'',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['string-token', '\'one\\\ntwo\'', 0, 9, { value: 'onetwo' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
