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
 bar") and (fancy(baz))) {}',
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
				{ value: 200, type: 'integer', unit: 'px' },
			],
			[')-token', ')', 36, 36, undefined],
			['whitespace-token', ' ', 37, 37, undefined],
			['ident-token', 'and', 38, 40, { value: 'and' }],
			['whitespace-token', ' ', 41, 41, undefined],
			['(-token', '(', 42, 42, undefined],
			['ident-token', 'foo', 43, 45, { value: 'foo' }],
			['colon-token', ':', 46, 46, undefined],
			['whitespace-token', ' ', 47, 47, undefined],
			['string-token', '"\\A9 bar"', 48, 56, { value: '©bar' }],
			[')-token', ')', 57, 57, undefined],
			['whitespace-token', ' ', 58, 58, undefined],
			['ident-token', 'and', 59, 61, { value: 'and' }],
			['whitespace-token', ' ', 62, 62, undefined],
			['(-token', '(', 63, 63, undefined],
			['function-token', 'fancy(', 64, 69, { value: 'fancy' }],
			['ident-token', 'baz', 70, 72, { value: 'baz' }],
			[')-token', ')', 73, 73, undefined],
			[')-token', ')', 74, 74, undefined],
			[')-token', ')', 75, 75, undefined],
			['whitespace-token', ' ', 76, 76, undefined],
			['{-token', '{', 77, 77, undefined],
			['}-token', '}', 78, 78, undefined],
			['EOF-token', '', -1, -1, undefined],
		],
	);
}
