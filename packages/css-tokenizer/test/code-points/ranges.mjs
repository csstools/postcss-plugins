import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';

// Single characters
{
	const testCases = [
		[
			'\\00ae',
			[['ident-token', '\\00ae', 0, 4, { value: '®' }]],
		],
		[
			'\\00aE',
			[['ident-token', '\\00aE', 0, 4, { value: '®' }]],
		],
		[
			'\\00af',
			[['ident-token', '\\00af', 0, 4, { value: '¯' }]],
		],
		[
			'\\00aF',
			[['ident-token', '\\00aF', 0, 4, { value: '¯' }]],
		],
		[
			'\\00ag',
			[['ident-token', '\\00ag', 0, 4, { value: '\ng' }]],
		],
		[
			'\\00aG',
			[['ident-token', '\\00aG', 0, 4, { value: '\nG' }]],
		],
		[
			'\\7f',
			[['ident-token', '\\7f', 0, 2, { value: '\x7F' }]],
		],
		[
			'\\80',
			[['ident-token', '\\80', 0, 2, { value: '\x80' }]],
		],
		[
			'\\81',
			[['ident-token', '\\81', 0, 2, { value: '\x81' }]],
		],
		[
			'👨‍👨‍👧‍👦',
			[['ident-token', '👨‍👨‍👧‍👦', 0, 10, { value: '👨‍👨‍👧‍👦' }]],
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
