import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';
import fs from 'node:fs';

{
	const t = tokenizer({
		css: `
url( a )\
Url( b )\
uRl( c )\
urL( d )\
URl( e )\
uRL( f )\
UrL( g )\
URL( h )\
`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['whitespace-token', '\n', 0, 0, undefined],
			['url-token', 'url( a )', 1, 8, { value: 'a' }],
			['url-token', 'Url( b )', 9, 16, { value: 'b' }],
			['url-token', 'uRl( c )', 17, 24, { value: 'c' }],
			['url-token', 'urL( d )', 25, 32, { value: 'd' }],
			['url-token', 'URl( e )', 33, 40, { value: 'e' }],
			['url-token', 'uRL( f )', 41, 48, { value: 'f' }],
			['url-token', 'UrL( g )', 49, 56, { value: 'g' }],
			['url-token', 'URL( h )', 57, 64, { value: 'h' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: `
url("\\
https://\\
example.com\\
/some-path/\\
?query=param\\
&more-query=params")`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['whitespace-token', '\n', 0, 0, undefined],
			['function-token', 'url(', 1, 4, { value: 'url' }],
			[
				'string-token',
				'"\\\n' +
				'https://\\\n' +
				'example.com\\\n' +
				'/some-path/\\\n' +
				'?query=param\\\n' +
				'&more-query=params"',
				5,
				76,
				{
					value: 'https://example.com/some-path/?query=param&more-query=params',
				},
			],
			[')-token', ')', 77, 77, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: fs.readFileSync('./test/css/multi-line.css').toString(),
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['delim-token', '.', 0, 0, { value: '.' }],
			['ident-token', 'foo', 1, 3, { value: 'foo' }],
			['whitespace-token', ' ', 4, 4, undefined],
			['{-token', '{', 5, 5, undefined],
			['whitespace-token', '\n\t', 6, 7, undefined],
			['ident-token', 'src', 8, 10, { value: 'src' }],
			['colon-token', ':', 11, 11, undefined],
			['whitespace-token', ' ', 12, 12, undefined],
			['function-token', 'url(', 13, 16, { value: 'url' }],
			[
				'string-token',
				'"\\\n' +
				'https: //\\\n' +
				'example.com\\\n' +
				'/some-path/\\\n' +
				'?query=param\\\n' +
				'&more-query=params"',
				17,
				89,
				{
					value: 'https: //example.com/some-path/?query=param&more-query=params',
				},
			],
			[')-token', ')', 90, 90, undefined],
			['semicolon-token', ';', 91, 91, undefined],
			['whitespace-token', '\n', 92, 92, undefined],
			['}-token', '}', 93, 93, undefined],
			['whitespace-token', '\n', 94, 94, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'url(https://example.com a',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['bad-url-token', 'url(https://example.com a', 0, 24, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'url("https://example.com',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['function-token', 'url(', 0, 3, { value: 'url' }],
			[
				'string-token',
				'"https://example.com',
				4,
				23,
				{ value: 'https://example.com' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'url("https://example.com ',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['function-token', 'url(', 0, 3, { value: 'url' }],
			[
				'string-token',
				'"https://example.com ',
				4,
				24,
				{ value: 'https://example.com ' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'url(https://example.com',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'url-token',
				'url(https://example.com',
				0,
				22,
				{ value: 'https://example.com' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: 'url(https://example.com ',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			[
				'url-token',
				'url(https://example.com ',
				0,
				23,
				{ value: 'https://example.com' },
			],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t = tokenizer({
		css: `
url( 'single-quoted' )\
url( "double-quoted" )\
url( 'mix-quoted" ' )\
`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['whitespace-token', '\n', 0, 0, undefined],
			['function-token', 'url(', 1, 4, { value: 'url' }],
			['whitespace-token', ' ', 5, 5, undefined],
			[
				'string-token',
				// eslint-disable-next-line quotes
				"'single-quoted'",
				6,
				20,
				{ value: 'single-quoted' },
			],
			['whitespace-token', ' ', 21, 21, undefined],
			[')-token', ')', 22, 22, undefined],
			['function-token', 'url(', 23, 26, { value: 'url' }],
			['whitespace-token', ' ', 27, 27, undefined],
			[
				'string-token',
				'"double-quoted"',
				28,
				42,
				{ value: 'double-quoted' },
			],
			['whitespace-token', ' ', 43, 43, undefined],
			[')-token', ')', 44, 44, undefined],
			['function-token', 'url(', 45, 48, { value: 'url' }],
			['whitespace-token', ' ', 49, 49, undefined],
			[
				'string-token',
				// eslint-disable-next-line quotes
				`'mix-quoted" '`,
				50,
				63,
				{ value: 'mix-quoted" ' },
			],
			['whitespace-token', ' ', 64, 64, undefined],
			[')-token', ')', 65, 65, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

{
	const t1 = tokenizer({
		css: 'background-image:url(foo)',
	});

	const t2 = tokenizer({
		css: 'background-image:url(foo',
	});

	assert.deepEqual(
		collectTokens(t1).map((x) => {
			x[1] = '';
			x[3] = 0;
			return x;
		}),
		collectTokens(t2).map((x) => {
			x[1] = '';
			x[3] = 0;
			return x;
		}),
	);
}

{
	const t1 = tokenizer({
		css: 'background-image:url()',
	});

	const t2 = tokenizer({
		css: 'background-image:url(',
	});

	assert.deepEqual(
		collectTokens(t1).map((x) => {
			x[1] = '';
			x[3] = 0;
			return x;
		}),
		collectTokens(t2).map((x) => {
			x[1] = '';
			x[3] = 0;
			return x;
		}),
	);
}

{
	const t = tokenizer({
		css: 'url(foo())',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['bad-url-token', 'url(foo()', 0, 8, undefined],
			[')-token', ')', 9, 9, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}

// Whitespace before contents
// https://github.com/w3c/csswg-drafts/issues/8280
{
	{
		const t = tokenizer({
			css: 'url("foo")',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['function-token', 'url(', 0, 3, { value: 'url' }],
				['string-token', '"foo"', 4, 8, { value: 'foo' }],
				[')-token', ')', 9, 9, undefined],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: 'url( "foo")',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['function-token', 'url(', 0, 3, { value: 'url' }],
				['whitespace-token', ' ', 4, 4, undefined],
				['string-token', '"foo"', 5, 9, { value: 'foo' }],
				[')-token', ')', 10, 10, undefined],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: 'url(  "foo")',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['function-token', 'url(', 0, 3, { value: 'url' }],
				['whitespace-token', '  ', 4, 5, undefined],
				['string-token', '"foo"', 6, 10, { value: 'foo' }],
				[')-token', ')', 11, 11, undefined],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: 'not-url(  "foo")',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['function-token', 'not-url(', 0, 7, { value: 'not-url' }],
				['whitespace-token', '  ', 8, 9, undefined],
				['string-token', '"foo"', 10, 14, { value: 'foo' }],
				[')-token', ')', 15, 15, undefined],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: 'url(   "foo")',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['function-token', 'url(', 0, 3, { value: 'url' }],
				['whitespace-token', '   ', 4, 6, undefined],
				['string-token', '"foo"', 7, 11, { value: 'foo' }],
				[')-token', ')', 12, 12, undefined],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}

	{
		const t = tokenizer({
			css: 'url(   foo)',
		});

		assert.deepEqual(
			collectTokens(t),
			[
				['url-token', 'url(   foo)', 0, 10, { value: 'foo' }],
				['EOF-token', '', -1, -1, undefined],
			],
		);
	}
}

{
	const t = tokenizer({
		css: 'url( \\) )',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['url-token', 'url( \\) )', 0, 8, { value: ')' }],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
