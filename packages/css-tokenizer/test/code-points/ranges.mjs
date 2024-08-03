import { tokenizer, tokenize, mutateIdent } from '@csstools/css-tokenizer';
import assert from 'node:assert';
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

{
	// https://github.com/web-platform-tests/wpt/blob/f2d921a661409a7261ad20f6026ab75839e2c973/css/css-syntax/non-ascii-codepoints.html
	const testValid = (cp) => {
		const tokens = tokenize({ css: 'f' + String.fromCodePoint(cp) + 'oo' });

		assert.equal(tokens[0][0], 'ident-token', `Codepoint U+${cp.toString(16)} is a valid 'non-ASCII ident codepoint'.`);
		assert.equal(tokens.length, 2, `Codepoint U+${cp.toString(16)} is a valid 'non-ASCII ident codepoint'.`);
	};

	const testMutation = (cp) => {
		// Just skip if the codepoint is outside the possible range.
		if (cp > 0x1ffff) {
			return;
		}

		const token = ['ident-token', 'foo', -1, -1, { value: 'foo' }];
		mutateIdent(
			token,
			'f' + String.fromCodePoint(cp) + 'oo',
		);

		const tokens = tokenize({ css: token[1] });

		assert.equal(tokens[0][0], 'ident-token', `Codepoint U+${cp.toString(16)} is a valid ident codepoint when escaped.`);
		assert.equal(tokens.length, 2, `Codepoint U+${cp.toString(16)} is a valid ident codepoint when escaped.`);
	};

	const testInvalid = (cp) => {
		// Just skip if the codepoint is outside the possible range.
		if (cp > 0x1ffff) {
			return;
		}

		const tokens = tokenize({ css: 'f' + String.fromCodePoint(cp) + 'oo' });
		assert.equal(tokens[0][0], 'ident-token', `Codepoint U+${cp.toString(16)} is not a 'non-ASCII ident codepoint'.`);
		assert.ok(tokens.length > 2, `Codepoint U+${cp.toString(16)} is not a 'non-ASCII ident codepoint'.`);

		testMutation(cp);
	};

	const testValidRanges = (ranges) => {
		// Takes an array of codepoints or codepoints ranges,
		// and tests whether the start, end, and middle of
		// each range is valid, and confirms that the
		// start/end of the regions between them are invalid.

		for (const range of ranges) {
			if (typeof range == 'number') {
				testValid(range);
				continue;
			}

			testValid(range[0]);

			if (range[1] - range[0] > 1) {
				testValid(Math.floor((range[0] + range[1]) / 2));
			}

			testValid(range[1]);
		}

		testInvalid(0x80);

		var lastTested = 0x80;
		for (const range of ranges) {
			if (typeof range == 'number') {
				if (range - 1 != lastTested) {
					testInvalid(range - 1);
				}
				testInvalid(range + 1);
				lastTested = range + 1;
				continue;
			}
			if (range[0] - 1 != lastTested) {
				testInvalid(range[0] - 1);
			}
			testInvalid(range[1] + 1);
			lastTested = range[1] + 1;
		}

	};

	testValidRanges([
		0xb7,
		[0xc0, 0xd6],
		[0xd8, 0xf6],
		[0xf8, 0x37d],
		[0x37f, 0x1fff],
		[0x200c, 0x200d],
		[0x203f, 0x2040],
		[0x2070, 0x218f],
		[0x2c00, 0x2fef],
		[0x3001, 0xd7ff],
		[0xf900, 0xfdcf],
		[0xfdf0, 0xfffd],
		[0x10000, 0x1ffff],
	]);
}
