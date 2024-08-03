import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';

// Single characters
{
	const testCases = [
		[
			'a',
			[['ident-token', 'a', 0, 0, { value: 'a' }]],
		],
		[
			'\\',
			[['ident-token', '\\', 0, 0, { value: '�' }]],
		],
		[
			'\\\\',
			[['ident-token', '\\\\', 0, 1, { value: '\\' }]],
		],
		[
			'§',
			[['delim-token', '§', 0, 0, { value: '§' }]],
		],
		[
			'±',
			[['delim-token', '±', 0, 0, { value: '±' }]],
		],
		[
			'!',
			[['delim-token', '!', 0, 0, { value: '!' }]],
		],
		[
			'@',
			[['delim-token', '@', 0, 0, { value: '@' }]],
		],
		[
			'#',
			[['delim-token', '#', 0, 0, { value: '#' }]],
		],
		[
			'$',
			[['delim-token', '$', 0, 0, { value: '$' }]],
		],
		[
			'%',
			[['delim-token', '%', 0, 0, { value: '%' }]],
		],
		[
			'^',
			[['delim-token', '^', 0, 0, { value: '^' }]],
		],
		[
			'&',
			[['delim-token', '&', 0, 0, { value: '&' }]],
		],
		[
			'*',
			[['delim-token', '*', 0, 0, { value: '*' }]],
		],
		[
			'(',
			[['(-token', '(', 0, 0, undefined]],
		],
		[
			')',
			[[')-token', ')', 0, 0, undefined]],
		],
		[
			'-',
			[['delim-token', '-', 0, 0, { value: '-' }]],
		],
		[
			'_',
			[['ident-token', '_', 0, 0, { value: '_' }]],
		],
		[
			'+',
			[['delim-token', '+', 0, 0, { value: '+' }]],
		],
		[
			'=',
			[['delim-token', '=', 0, 0, { value: '=' }]],
		],
		[
			'[',
			[['[-token', '[', 0, 0, undefined]],
		],
		[
			']',
			[[']-token', ']', 0, 0, undefined]],
		],
		[
			'{',
			[['{-token', '{', 0, 0, undefined]],
		],
		[
			'}',
			[['}-token', '}', 0, 0, undefined]],
		],
		[
			';',
			[['semicolon-token', ';', 0, 0, undefined]],
		],
		[
			':',
			[['colon-token', ':', 0, 0, undefined]],
		],
		[
			'`',
			[['delim-token', '`', 0, 0, { value: '`' }]],
		],
		[
			'~',
			[['delim-token', '~', 0, 0, { value: '~' }]],
		],
		[
			'\'',
			[['string-token', '\'', 0, 0, { value: '' }]],
		],
		[
			'"',
			[['string-token', '"', 0, 0, { value: '' }]],
		],
		[
			'|',
			[['delim-token', '|', 0, 0, { value: '|' }]],
		],
		[
			',',
			[['comma-token', ',', 0, 0, undefined]],
		],
		[
			'<',
			[['delim-token', '<', 0, 0, { value: '<' }]],
		],
		[
			'>',
			[['delim-token', '>', 0, 0, { value: '>' }]],
		],
		[
			'.',
			[['delim-token', '.', 0, 0, { value: '.' }]],
		],
		[
			'?',
			[['delim-token', '?', 0, 0, { value: '?' }]],
		],
		[
			'/',
			[['delim-token', '/', 0, 0, { value: '/' }]],
		],
	];

	testCases.forEach((testCase) => {
		const t = tokenizer({
			css: testCase[0],
		});

		assert.deepEqual(
			collectTokens(t).slice(0,-1),
			testCase[1],
		);
	});
}


// Followed by a letter
{
	const testCases = [
		[
			'aa',
			[['ident-token', 'aa', 0, 1, { value: 'aa' }]],
		],
		[
			'\\a',
			[['ident-token', '\\a', 0, 1, { value: '\n' }]],
		],
		[
			'\\\\a',
			[['ident-token', '\\\\a', 0, 2, { value: '\\a' }]],
		],
		[
			'§a',
			[
				['delim-token', '§', 0, 0, { value: '§' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'±a',
			[
				['delim-token', '±', 0, 0, { value: '±' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'!a',
			[
				['delim-token', '!', 0, 0, { value: '!' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'@a',
			[['at-keyword-token', '@a', 0, 1, { value: 'a' }]],
		],
		[
			'#a',
			[['hash-token', '#a', 0, 1, { value: 'a', type: 'id' }]],
		],
		[
			'$a',
			[
				['delim-token', '$', 0, 0, { value: '$' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'%a',
			[
				['delim-token', '%', 0, 0, { value: '%' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'^a',
			[
				['delim-token', '^', 0, 0, { value: '^' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'&a',
			[
				['delim-token', '&', 0, 0, { value: '&' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'*a',
			[
				['delim-token', '*', 0, 0, { value: '*' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'(a',
			[
				['(-token', '(', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			')a',
			[
				[')-token', ')', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'-a',
			[['ident-token', '-a', 0, 1, { value: '-a' }]],
		],
		[
			'_a',
			[['ident-token', '_a', 0, 1, { value: '_a' }]],
		],
		[
			'+a',
			[
				['delim-token', '+', 0, 0, { value: '+' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'=a',
			[
				['delim-token', '=', 0, 0, { value: '=' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'[a',
			[
				['[-token', '[', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			']a',
			[
				[']-token', ']', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'{a',
			[
				['{-token', '{', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'}a',
			[
				['}-token', '}', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			';a',
			[
				['semicolon-token', ';', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			':a',
			[
				['colon-token', ':', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'`a',
			[
				['delim-token', '`', 0, 0, { value: '`' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'~a',
			[
				['delim-token', '~', 0, 0, { value: '~' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'\'a',
			[['string-token', '\'a', 0, 1, { value: 'a' }]],
		],
		[
			'"a',
			[['string-token', '"a', 0, 1, { value: 'a' }]],
		],
		[
			'|a',
			[
				['delim-token', '|', 0, 0, { value: '|' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			',a',
			[
				['comma-token', ',', 0, 0, undefined],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'<a',
			[
				['delim-token', '<', 0, 0, { value: '<' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'>a',
			[
				['delim-token', '>', 0, 0, { value: '>' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'.a',
			[
				['delim-token', '.', 0, 0, { value: '.' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'?a',
			[
				['delim-token', '?', 0, 0, { value: '?' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
		[
			'/a',
			[
				['delim-token', '/', 0, 0, { value: '/' }],
				['ident-token', 'a', 1, 1, { value: 'a' }],
			],
		],
	];

	testCases.forEach((testCase) => {
		const t = tokenizer({
			css: testCase[0],
		});

		assert.deepEqual(
			collectTokens(t).slice(0, -1),
			testCase[1],
		);
	});
}

// Complex codepoints
{
	const testCases = [
		[
			'🤲🏽',
			[['ident-token', '🤲🏽', 0, 3, { value: '🤲🏽' }]],
		],
		[
			'🤲🏽🤲🏽',
			[['ident-token', '🤲🏽🤲🏽', 0, 7, { value: '🤲🏽🤲🏽' }]],
		],
		[
			'🤲🏽 🤲🏽',
			[
				['ident-token', '🤲🏽', 0, 3, { value: '🤲🏽' }],
				['whitespace-token', ' ', 4, 4, undefined],
				['ident-token', '🤲🏽', 5, 8, { value: '🤲🏽' }],
			],
		],
		[
			'🤲🏽/🤲🏽',
			[
				['ident-token', '🤲🏽', 0, 3, { value: '🤲🏽' }],
				['delim-token', '/', 4, 4, { value: '/' }],
				['ident-token', '🤲🏽', 5, 8, { value: '🤲🏽' }],
			],
		],
		[
			'😀',
			[['ident-token', '😀', 0, 1, { value: '😀' }]],
		],
		[
			'😀😀',
			[['ident-token', '😀😀', 0, 3, { value: '😀😀' }]],
		],
		[
			'😀 😀',
			[
				['ident-token', '😀', 0, 1, { value: '😀' }],
				['whitespace-token', ' ', 2, 2, undefined],
				['ident-token', '😀', 3, 4, { value: '😀' }],
			],
		],
		[
			'😀/😀',
			[
				['ident-token', '😀', 0, 1, { value: '😀' }],
				['delim-token', '/', 2, 2, { value: '/' }],
				['ident-token', '😀', 3, 4, { value: '😀' }],
			],
		],
		[
			'å',
			[['ident-token', 'å', 0, 1, { value: 'å' }]],
		],
		[
			'åå',
			[['ident-token', 'åå', 0, 3, { value: 'åå' }]],
		],
		[
			'å å',
			[
				['ident-token', 'å', 0, 1, { value: 'å' }],
				['whitespace-token', ' ', 2, 2, undefined],
				['ident-token', 'å', 3, 4, { value: 'å' }],
			],
		],
		[
			'å/å',
			[
				['ident-token', 'å', 0, 1, { value: 'å' }],
				['delim-token', '/', 2, 2, { value: '/' }],
				['ident-token', 'å', 3, 4, { value: 'å' }],
			],
		],
		[
			'café',
			[['ident-token', 'café', 0, 4, { value: 'café' }]],
		],
		[
			'cafécafé',
			[['ident-token', 'cafécafé', 0, 9, { value: 'cafécafé' }]],
		],
		[
			'café café',
			[
				['ident-token', 'café', 0, 4, { value: 'café' }],
				['whitespace-token', ' ', 5, 5, undefined],
				['ident-token', 'café', 6, 10, { value: 'café' }],
			],
		],
		[
			'café/café',
			[
				['ident-token', 'café', 0, 4, { value: 'café' }],
				['delim-token', '/', 5, 5, { value: '/' }],
				['ident-token', 'café', 6, 10, { value: 'café' }],
			],
		],
	];

	testCases.forEach((testCase) => {
		const t = tokenizer({
			css: testCase[0],
		});

		assert.deepEqual(
			collectTokens(t).slice(0, -1),
			testCase[1],
		);
	});
}
