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
		css: '@media screen and (min-width: 200px) {}',
	});

	assert.deepEqual(
		collectTokens(t),
		[
			['at-keyword-token', '@media', 0, 5, { value: 'media' }],
			['whitespace-token', ' ', 6, 6],
			['delim-token', 's', 7, 7, { value: 's' }],
			['delim-token', 'c', 8, 8, { value: 'c' }],
			['delim-token', 'r', 9, 9, { value: 'r' }],
			['delim-token', 'e', 10, 10, { value: 'e' }],
			['delim-token', 'e', 11, 11, { value: 'e' }],
			['delim-token', 'n', 12, 12, { value: 'n' }],
			['whitespace-token', ' ', 13, 13],
			['delim-token', 'a', 14, 14, { value: 'a' }],
			['delim-token', 'n', 15, 15, { value: 'n' }],
			['delim-token', 'd', 16, 16, { value: 'd' }],
			['whitespace-token', ' ', 17, 17],
			['(-token', '(', 18, 18],
			['delim-token', 'm', 19, 19, { value: 'm' }],
			['delim-token', 'i', 20, 20, { value: 'i' }],
			['delim-token', 'n', 21, 21, { value: 'n' }],
			['delim-token', '-', 22, 22, { value: '-' }],
			['delim-token', 'w', 23, 23, { value: 'w' }],
			['delim-token', 'i', 24, 24, { value: 'i' }],
			['delim-token', 'd', 25, 25, { value: 'd' }],
			['delim-token', 't', 26, 26, { value: 't' }],
			['delim-token', 'h', 27, 27, { value: 'h' }],
			['colon-token', ':', 28, 28],
			['whitespace-token', ' ', 29, 29],
			[
				'dimension-token',
				'200px',
				30,
				34,
				{ value: 200, type: 'integer', unit: 'px' },
			],
			[')-token', ')', 35, 35],
			['whitespace-token', ' ', 36, 36],
			['{-token', '{', 37, 37],
			['}-token', '}', 38, 38],
			['EOF-token', '', -1, -1],
		],
	);
}
