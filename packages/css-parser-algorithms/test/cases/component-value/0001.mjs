import { tokenize } from '@csstools/css-tokenizer';
import test from 'node:test';
import { parseComponentValue } from '@csstools/css-parser-algorithms';

const onParseError = (err) => {
	throw err;
};

test('component-value', () => {
	const cases = [
		{
			tokens: tokenize({ css: 'foo()' }, { onParseError: onParseError }),
			expectSuccess: true,
		},
		{
			tokens: tokenize({ css: 'foo()' }, { onParseError: onParseError }).slice(0, -1),
			expectSuccess: true,
		},
		{
			tokens: 'foo() bar',
			expectSuccess: false,
		},
	];

	cases.forEach((testCase) => {
		let didError = false;

		const result = parseComponentValue(testCase.tokens, {
			onParseError: (err) => {
				didError = true;

				if (testCase.expectSuccess) {
					throw err;
				}
			},
		});

		if (testCase.expectSuccess && !result) {
			throw new Error('Expected test to pass and have a result');
		}

		if (!testCase.expectSuccess && !didError) {
			throw new Error('Expected test to fail');
		}
	});
});
