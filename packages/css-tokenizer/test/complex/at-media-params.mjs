import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import { collectTokens } from '../util/collect-tokens.mjs';

{
	const testCases = [
		[
			'screen',
			[['ident-token', 'screen', 0, 5, { value: 'screen' }]],
		],
		[
			'true',
			[['ident-token', 'true', 0, 3, { value: 'true' }]],
		],
		[
			'false',
			[['ident-token', 'false', 0, 4, { value: 'false' }]],
		],
		[
			'only screen',
			[
				['ident-token', 'only', 0, 3, { value: 'only' }],
				['whitespace-token', ' ', 4, 4, undefined],
				['ident-token', 'screen', 5, 10, { value: 'screen' }],
			],
		],
		[
			'only screen and (min-width: 10px)',
			[
				['ident-token', 'only', 0, 3, { value: 'only' }],
				['whitespace-token', ' ', 4, 4, undefined],
				['ident-token', 'screen', 5, 10, { value: 'screen' }],
				['whitespace-token', ' ', 11, 11, undefined],
				['ident-token', 'and', 12, 14, { value: 'and' }],
				['whitespace-token', ' ', 15, 15, undefined],
				['(-token', '(', 16, 16, undefined],
				['ident-token', 'min-width', 17, 25, { value: 'min-width' }],
				['colon-token', ':', 26, 26, undefined],
				['whitespace-token', ' ', 27, 27, undefined],
				[
					'dimension-token',
					'10px',
					28,
					31,
					{ value: 10, signCharacter: undefined, type: 'integer', unit: 'px' },
				],
				[')-token', ')', 32, 32, undefined],
			],
		],
		[
			'(10rem <= width <= 40rem)',
			[
				['(-token', '(', 0, 0, undefined],
				[
					'dimension-token',
					'10rem',
					1,
					5,
					{ value: 10, signCharacter: undefined, type: 'integer', unit: 'rem' },
				],
				['whitespace-token', ' ', 6, 6, undefined],
				['delim-token', '<', 7, 7, { value: '<' }],
				['delim-token', '=', 8, 8, { value: '=' }],
				['whitespace-token', ' ', 9, 9, undefined],
				['ident-token', 'width', 10, 14, { value: 'width' }],
				['whitespace-token', ' ', 15, 15, undefined],
				['delim-token', '<', 16, 16, { value: '<' }],
				['delim-token', '=', 17, 17, { value: '=' }],
				['whitespace-token', ' ', 18, 18, undefined],
				[
					'dimension-token',
					'40rem',
					19,
					23,
					{ value: 40, signCharacter: undefined, type: 'integer', unit: 'rem' },
				],
				[')-token', ')', 24, 24, undefined],
			],
		],
		[
			'(40rem > width > 10rem)',
			[
				['(-token', '(', 0, 0, undefined],
				[
					'dimension-token',
					'40rem',
					1,
					5,
					{ value: 40, signCharacter: undefined, type: 'integer', unit: 'rem' },
				],
				['whitespace-token', ' ', 6, 6, undefined],
				['delim-token', '>', 7, 7, { value: '>' }],
				['whitespace-token', ' ', 8, 8, undefined],
				['ident-token', 'width', 9, 13, { value: 'width' }],
				['whitespace-token', ' ', 14, 14, undefined],
				['delim-token', '>', 15, 15, { value: '>' }],
				['whitespace-token', ' ', 16, 16, undefined],
				[
					'dimension-token',
					'10rem',
					17,
					21,
					{ value: 10, signCharacter: undefined, type: 'integer', unit: 'rem' },
				],
				[')-token', ')', 22, 22, undefined],
			],
		],
		[
			'(--custom-mq)',
			[
				['(-token', '(', 0, 0, undefined],
				['ident-token', '--custom-mq', 1, 11, { value: '--custom-mq' }],
				[')-token', ')', 12, 12, undefined],
			],
		],
		[
			'screen/* a comment */(--custom-mq)',
			[
				['ident-token', 'screen', 0, 5, { value: 'screen' }],
				['comment', '/* a comment */', 6, 20, undefined],
				['(-token', '(', 21, 21, undefined],
				['ident-token', '--custom-mq', 22, 32, { value: '--custom-mq' }],
				[')-token', ')', 33, 33, undefined],
			],
		],
		[
			'((min-width: 300px) and (prefers-color-scheme: dark))',
			[
				['(-token', '(', 0, 0, undefined],
				['(-token', '(', 1, 1, undefined],
				['ident-token', 'min-width', 2, 10, { value: 'min-width' }],
				['colon-token', ':', 11, 11, undefined],
				['whitespace-token', ' ', 12, 12, undefined],
				[
					'dimension-token',
					'300px',
					13,
					17,
					{ value: 300, signCharacter: undefined, type: 'integer', unit: 'px' },
				],
				[')-token', ')', 18, 18, undefined],
				['whitespace-token', ' ', 19, 19, undefined],
				['ident-token', 'and', 20, 22, { value: 'and' }],
				['whitespace-token', ' ', 23, 23, undefined],
				['(-token', '(', 24, 24, undefined],
				[
					'ident-token',
					'prefers-color-scheme',
					25,
					44,
					{ value: 'prefers-color-scheme' },
				],
				['colon-token', ':', 45, 45, undefined],
				['whitespace-token', ' ', 46, 46, undefined],
				['ident-token', 'dark', 47, 50, { value: 'dark' }],
				[')-token', ')', 51, 51, undefined],
				[')-token', ')', 52, 52, undefined],
			],
		],
		[
			'((min-width:300px)and (prefers-color-scheme:dark))',
			[
				['(-token', '(', 0, 0, undefined],
				['(-token', '(', 1, 1, undefined],
				['ident-token', 'min-width', 2, 10, { value: 'min-width' }],
				['colon-token', ':', 11, 11, undefined],
				[
					'dimension-token',
					'300px',
					12,
					16,
					{ value: 300, signCharacter: undefined, type: 'integer', unit: 'px' },
				],
				[')-token', ')', 17, 17, undefined],
				['ident-token', 'and', 18, 20, { value: 'and' }],
				['whitespace-token', ' ', 21, 21, undefined],
				['(-token', '(', 22, 22, undefined],
				[
					'ident-token',
					'prefers-color-scheme',
					23,
					42,
					{ value: 'prefers-color-scheme' },
				],
				['colon-token', ':', 43, 43, undefined],
				['ident-token', 'dark', 44, 47, { value: 'dark' }],
				[')-token', ')', 48, 48, undefined],
				[')-token', ')', 49, 49, undefined],
			],
		],
		[
			' ( ( min-width : 300px ) and ( prefers-color-scheme : dark ) )  ',
			[
				['whitespace-token', ' ', 0, 0, undefined],
				['(-token', '(', 1, 1, undefined],
				['whitespace-token', ' ', 2, 2, undefined],
				['(-token', '(', 3, 3, undefined],
				['whitespace-token', ' ', 4, 4, undefined],
				['ident-token', 'min-width', 5, 13, { value: 'min-width' }],
				['whitespace-token', ' ', 14, 14, undefined],
				['colon-token', ':', 15, 15, undefined],
				['whitespace-token', ' ', 16, 16, undefined],
				[
					'dimension-token',
					'300px',
					17,
					21,
					{ value: 300, signCharacter: undefined, type: 'integer', unit: 'px' },
				],
				['whitespace-token', ' ', 22, 22, undefined],
				[')-token', ')', 23, 23, undefined],
				['whitespace-token', ' ', 24, 24, undefined],
				['ident-token', 'and', 25, 27, { value: 'and' }],
				['whitespace-token', ' ', 28, 28, undefined],
				['(-token', '(', 29, 29, undefined],
				['whitespace-token', ' ', 30, 30, undefined],
				[
					'ident-token',
					'prefers-color-scheme',
					31,
					50,
					{ value: 'prefers-color-scheme' },
				],
				['whitespace-token', ' ', 51, 51, undefined],
				['colon-token', ':', 52, 52, undefined],
				['whitespace-token', ' ', 53, 53, undefined],
				['ident-token', 'dark', 54, 57, { value: 'dark' }],
				['whitespace-token', ' ', 58, 58, undefined],
				[')-token', ')', 59, 59, undefined],
				['whitespace-token', ' ', 60, 60, undefined],
				[')-token', ')', 61, 61, undefined],
				['whitespace-token', '  ', 62, 63, undefined],
			],
		],
	];

	testCases.forEach((testCase) => {
		const t = tokenizer({
			css: testCase[0],
		});

		const tokens = collectTokens(t);

		assert.deepEqual(
			tokens.slice(0, -1),
			testCase[1],
		);

		assert.deepEqual(
			tokens[tokens.length -1][0],
			'EOF-token',
		);
	});
}
