import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';

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
url(\
https://\
example.com\
/some-path/\
?query=param\
&more-query=params\
)\
`,
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['whitespace-token', '\n', 0, 0, undefined],
			[
				'url-token',
				'url(https://example.com/some-path/?query=param&more-query=params)',
				1,
				65,
				{
					value: 'https://example.com/some-path/?query=param&more-query=params',
				},
			],
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
