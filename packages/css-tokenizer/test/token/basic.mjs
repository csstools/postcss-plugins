import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';

function collectTokens(t) {
	const bag = [];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		bag.push(t.nextToken());

		if (!bag[bag.length - 1]) {
			break;
		}

		if (bag[bag.length - 1][0] === 'EOF-token') {
			break;
		}
	}

	return bag;
}

{
	const t = tokenizer({
		css: '@media screen and ((min-width: 200px) and (foo: "\\A9\
 bar") {}',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['at-keyword-token', '@media', 0, 5, { value: 'media' }],
			['whitespace-token', ' ', 6, 6, undefined],
			['delim-token', 's', 7, 7, { value: 's' }],
			['delim-token', 'c', 8, 8, { value: 'c' }],
			['delim-token', 'r', 9, 9, { value: 'r' }],
			['delim-token', 'e', 10, 10, { value: 'e' }],
			['delim-token', 'e', 11, 11, { value: 'e' }],
			['delim-token', 'n', 12, 12, { value: 'n' }],
			['whitespace-token', ' ', 13, 13, undefined],
			['delim-token', 'a', 14, 14, { value: 'a' }],
			['delim-token', 'n', 15, 15, { value: 'n' }],
			['delim-token', 'd', 16, 16, { value: 'd' }],
			['whitespace-token', ' ', 17, 17, undefined],
			['(-token', '(', 18, 18, undefined],
			['(-token', '(', 19, 19, undefined],
			['delim-token', 'm', 20, 20, { value: 'm' }],
			['delim-token', 'i', 21, 21, { value: 'i' }],
			['delim-token', 'n', 22, 22, { value: 'n' }],
			['delim-token', '-', 23, 23, { value: '-' }],
			['delim-token', 'w', 24, 24, { value: 'w' }],
			['delim-token', 'i', 25, 25, { value: 'i' }],
			['delim-token', 'd', 26, 26, { value: 'd' }],
			['delim-token', 't', 27, 27, { value: 't' }],
			['delim-token', 'h', 28, 28, { value: 'h' }],
			['colon-token', ':', 29, 29, undefined],
			['whitespace-token', ' ', 30, 30, undefined],
			[
				'dimension-token',
				'200px',
				31,
				35,
				{ value: 200, type: 'integer', unit: 'px' },
			],
			[')-token', ')', 36, 36, undefined],
			['whitespace-token', ' ', 37, 37, undefined],
			['delim-token', 'a', 38, 38, { value: 'a' }],
			['delim-token', 'n', 39, 39, { value: 'n' }],
			['delim-token', 'd', 40, 40, { value: 'd' }],
			['whitespace-token', ' ', 41, 41, undefined],
			['(-token', '(', 42, 42, undefined],
			['delim-token', 'f', 43, 43, { value: 'f' }],
			['delim-token', 'o', 44, 44, { value: 'o' }],
			['delim-token', 'o', 45, 45, { value: 'o' }],
			['colon-token', ':', 46, 46, undefined],
			['whitespace-token', ' ', 47, 47, undefined],
			['string-token', '"\\A9 bar"', 48, 56, { value: '© bar' }],
			[')-token', ')', 57, 57, undefined],
			['whitespace-token', ' ', 58, 58, undefined],
			['{-token', '{', 59, 59, undefined],
			['}-token', '}', 60, 60, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
