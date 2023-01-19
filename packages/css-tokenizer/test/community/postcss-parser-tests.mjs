import { eachTest } from 'postcss-parser-tests';
import assert from 'assert';
import { tokenizer, stringify, TokenType } from '@csstools/css-tokenizer';

eachTest((name, css) => {
	const t = tokenizer(
		{
			css: css,
		},
		{
			onParseError: (err) => {
				// We only expect something like bootstrap to tokenize without parser errors.
				throw new Error(JSON.stringify(err));
			},
		},
	);

	const tokens = [];

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const token = t.nextToken();
		if (token[0] === TokenType.EOF) {
			break;
		}

		tokens.push(token);
	}

	const result = stringify(...tokens);
	assert.equal(result, css, `expected "${name}" from 'postcss-parser-tests' to tokenize and stringify without mutations.`);
});

