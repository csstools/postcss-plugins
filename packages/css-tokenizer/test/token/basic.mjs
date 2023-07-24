import { tokenizer, tokenize } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const t = tokenizer({
		css: '@charset "utf-8";',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['at-keyword-token', '@charset', 0, 7, { value: 'charset' }],
			['whitespace-token', ' ', 8, 8, undefined],
			['string-token', '"utf-8"', 9, 15, { value: 'utf-8' }],
			['semicolon-token', ';', 16, 16, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	assert.deepEqual(
		tokenize({
			css: '@charset "utf-8";',
		}),
		[
			['at-keyword-token', '@charset', 0, 7, { value: 'charset' }],
			['whitespace-token', ' ', 8, 8, undefined],
			['string-token', '"utf-8"', 9, 15, { value: 'utf-8' }],
			['semicolon-token', ';', 16, 16, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'foo { width: calc(-infinity) }',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', 'foo', 0, 2, { value: 'foo' }],
			['whitespace-token', ' ', 3, 3, undefined],
			['{-token', '{', 4, 4, undefined],
			['whitespace-token', ' ', 5, 5, undefined],
			['ident-token', 'width', 6, 10, { value: 'width' }],
			['colon-token', ':', 11, 11, undefined],
			['whitespace-token', ' ', 12, 12, undefined],
			['function-token', 'calc(', 13, 17, { value: 'calc' }],
			['ident-token', '-infinity', 18, 26, { value: '-infinity' }],
			[')-token', ')', 27, 27, undefined],
			['whitespace-token', ' ', 28, 28, undefined],
			['}-token', '}', 29, 29, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '@import url(https://example.com/stylesheet.css) layer( base.tokens ) supports( display: grid ) not screen and ((400px <= width < 1024px) and (prefers-color-scheme: dark));',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['at-keyword-token', '@import', 0, 6, { value: 'import' }],
			['whitespace-token', ' ', 7, 7, undefined],
			[
				'url-token',
				'url(https://example.com/stylesheet.css)',
				8,
				46,
				{ value: 'https://example.com/stylesheet.css' },
			],
			['whitespace-token', ' ', 47, 47, undefined],
			['function-token', 'layer(', 48, 53, { value: 'layer' }],
			['whitespace-token', ' ', 54, 54, undefined],
			['ident-token', 'base', 55, 58, { value: 'base' }],
			['delim-token', '.', 59, 59, { value: '.' }],
			['ident-token', 'tokens', 60, 65, { value: 'tokens' }],
			['whitespace-token', ' ', 66, 66, undefined],
			[')-token', ')', 67, 67, undefined],
			['whitespace-token', ' ', 68, 68, undefined],
			['function-token', 'supports(', 69, 77, { value: 'supports' }],
			['whitespace-token', ' ', 78, 78, undefined],
			['ident-token', 'display', 79, 85, { value: 'display' }],
			['colon-token', ':', 86, 86, undefined],
			['whitespace-token', ' ', 87, 87, undefined],
			['ident-token', 'grid', 88, 91, { value: 'grid' }],
			['whitespace-token', ' ', 92, 92, undefined],
			[')-token', ')', 93, 93, undefined],
			['whitespace-token', ' ', 94, 94, undefined],
			['ident-token', 'not', 95, 97, { value: 'not' }],
			['whitespace-token', ' ', 98, 98, undefined],
			['ident-token', 'screen', 99, 104, { value: 'screen' }],
			['whitespace-token', ' ', 105, 105, undefined],
			['ident-token', 'and', 106, 108, { value: 'and' }],
			['whitespace-token', ' ', 109, 109, undefined],
			['(-token', '(', 110, 110, undefined],
			['(-token', '(', 111, 111, undefined],
			[
				'dimension-token',
				'400px',
				112,
				116,
				{
					value: 400,
					signCharacter: undefined,
					type: 'integer',
					unit: 'px',
				},
			],
			['whitespace-token', ' ', 117, 117, undefined],
			['delim-token', '<', 118, 118, { value: '<' }],
			['delim-token', '=', 119, 119, { value: '=' }],
			['whitespace-token', ' ', 120, 120, undefined],
			['ident-token', 'width', 121, 125, { value: 'width' }],
			['whitespace-token', ' ', 126, 126, undefined],
			['delim-token', '<', 127, 127, { value: '<' }],
			['whitespace-token', ' ', 128, 128, undefined],
			[
				'dimension-token',
				'1024px',
				129,
				134,
				{
					value: 1024,
					signCharacter: undefined,
					type: 'integer',
					unit: 'px',
				},
			],
			[')-token', ')', 135, 135, undefined],
			['whitespace-token', ' ', 136, 136, undefined],
			['ident-token', 'and', 137, 139, { value: 'and' }],
			['whitespace-token', ' ', 140, 140, undefined],
			['(-token', '(', 141, 141, undefined],
			[
				'ident-token',
				'prefers-color-scheme',
				142,
				161,
				{ value: 'prefers-color-scheme' },
			],
			['colon-token', ':', 162, 162, undefined],
			['whitespace-token', ' ', 163, 163, undefined],
			['ident-token', 'dark', 164, 167, { value: 'dark' }],
			[')-token', ')', 168, 168, undefined],
			[')-token', ')', 169, 169, undefined],
			['semicolon-token', ';', 170, 170, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: `@media only screen and (min-width: 768rem) {
	.foo {
		content: 'Some content!' !important;
	}
}
`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['at-keyword-token', '@media', 0, 5, { value: 'media' }],
			['whitespace-token', ' ', 6, 6, undefined],
			['ident-token', 'only', 7, 10, { value: 'only' }],
			['whitespace-token', ' ', 11, 11, undefined],
			['ident-token', 'screen', 12, 17, { value: 'screen' }],
			['whitespace-token', ' ', 18, 18, undefined],
			['ident-token', 'and', 19, 21, { value: 'and' }],
			['whitespace-token', ' ', 22, 22, undefined],
			['(-token', '(', 23, 23, undefined],
			['ident-token', 'min-width', 24, 32, { value: 'min-width' }],
			['colon-token', ':', 33, 33, undefined],
			['whitespace-token', ' ', 34, 34, undefined],
			[
				'dimension-token',
				'768rem',
				35,
				40,
				{
					value: 768,
					signCharacter: undefined,
					type: 'integer',
					unit: 'rem',
				},
			],
			[')-token', ')', 41, 41, undefined],
			['whitespace-token', ' ', 42, 42, undefined],
			['{-token', '{', 43, 43, undefined],
			['whitespace-token', '\n\t', 44, 45, undefined],
			['delim-token', '.', 46, 46, { value: '.' }],
			['ident-token', 'foo', 47, 49, { value: 'foo' }],
			['whitespace-token', ' ', 50, 50, undefined],
			['{-token', '{', 51, 51, undefined],
			['whitespace-token', '\n\t\t', 52, 54, undefined],
			['ident-token', 'content', 55, 61, { value: 'content' }],
			['colon-token', ':', 62, 62, undefined],
			['whitespace-token', ' ', 63, 63, undefined],
			[
				'string-token',
				// eslint-disable-next-line quotes
				"'Some content!'",
				64,
				78,
				{ value: 'Some content!' },
			],
			['whitespace-token', ' ', 79, 79, undefined],
			['delim-token', '!', 80, 80, { value: '!' }],
			['ident-token', 'important', 81, 89, { value: 'important' }],
			['semicolon-token', ';', 90, 90, undefined],
			['whitespace-token', '\n\t', 91, 92, undefined],
			['}-token', '}', 93, 93, undefined],
			['whitespace-token', '\n', 94, 94, undefined],
			['}-token', '}', 95, 95, undefined],
			['whitespace-token', '\n', 96, 96, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: `@media screen and ((min-width: 200px) and (foo: "\\A9\\
bar") and (fancy(baz))) {}`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['at-keyword-token', '@media', 0, 5, { value: 'media' }],
			['whitespace-token', ' ', 6, 6, undefined],
			['ident-token', 'screen', 7, 12, { value: 'screen' }],
			['whitespace-token', ' ', 13, 13, undefined],
			['ident-token', 'and', 14, 16, { value: 'and' }],
			['whitespace-token', ' ', 17, 17, undefined],
			['(-token', '(', 18, 18, undefined],
			['(-token', '(', 19, 19, undefined],
			['ident-token', 'min-width', 20, 28, { value: 'min-width' }],
			['colon-token', ':', 29, 29, undefined],
			['whitespace-token', ' ', 30, 30, undefined],
			[
				'dimension-token',
				'200px',
				31,
				35,
				{
					value: 200,
					signCharacter: undefined,
					type: 'integer',
					unit: 'px',
				},
			],
			[')-token', ')', 36, 36, undefined],
			['whitespace-token', ' ', 37, 37, undefined],
			['ident-token', 'and', 38, 40, { value: 'and' }],
			['whitespace-token', ' ', 41, 41, undefined],
			['(-token', '(', 42, 42, undefined],
			['ident-token', 'foo', 43, 45, { value: 'foo' }],
			['colon-token', ':', 46, 46, undefined],
			['whitespace-token', ' ', 47, 47, undefined],
			['string-token', '"\\A9\\\nbar"', 48, 57, { value: '©bar' }],
			[')-token', ')', 58, 58, undefined],
			['whitespace-token', ' ', 59, 59, undefined],
			['ident-token', 'and', 60, 62, { value: 'and' }],
			['whitespace-token', ' ', 63, 63, undefined],
			['(-token', '(', 64, 64, undefined],
			['function-token', 'fancy(', 65, 70, { value: 'fancy' }],
			['ident-token', 'baz', 71, 73, { value: 'baz' }],
			[')-token', ')', 74, 74, undefined],
			[')-token', ')', 75, 75, undefined],
			[')-token', ')', 76, 76, undefined],
			['whitespace-token', ' ', 77, 77, undefined],
			['{-token', '{', 78, 78, undefined],
			['}-token', '}', 79, 79, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

// https://github.com/w3c/csswg-drafts/issues/5764
{
	{
		const t = tokenizer({
			css: ' -- ',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['whitespace-token', ' ', 0, 0, undefined],
				['ident-token', '--', 1, 2, { value: '--' }],
				['whitespace-token', ' ', 3, 3, undefined],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: '.--',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['delim-token', '.', 0, 0, { value: '.' }],
				['ident-token', '--', 1, 2, { value: '--' }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: ' _ ',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['whitespace-token', ' ', 0, 0, undefined],
				['ident-token', '_', 1, 1, { value: '_' }],
				['whitespace-token', ' ', 2, 2, undefined],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: '._',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['delim-token', '.', 0, 0, { value: '.' }],
				['ident-token', '_', 1, 1, { value: '_' }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}
}

{
	const t = tokenizer({
		css: '\\0',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\0', 0, 1, { value: '�' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: '\\',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\', 0, 0, { value: '�' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: `\\0
`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['ident-token', '\\0\n', 0, 2, { value: '�' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
