import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import postcssTokenizer from 'postcss/lib/tokenize';
import assert from 'node:assert';
import fs from 'node:fs';

const bootstrapSource = fs.readFileSync('./test/community/bootstrap.css').toString();
const openPropsSource = fs.readFileSync('./test/community/open-props.css').toString();

const source = `
/* a comment */
<!-- CDO -->

-->
/* more comments */

.foo {
	image: url(https://example.com/foo.jpg);
	image: url("https://example.com/foo.jpg");
}

.foo {
	image: url(();
}

.foo {
	content: "foo
bar";
}

#1 {}

#foo {}

.foo {
	margin: 0;
	margin: 1px;
	line-height: 1%;
	line-height: 1.2;
}

${bootstrapSource}
${openPropsSource}
`;

{
	const t = tokenizer(
		{
			css: source,
		},
		{
			onParseError: () => {
				// noop
			},
		},
	);

	let tokens = [];

	while (true) {
		const token = t.nextToken();
		tokens.push(token);

		if (token[0] === TokenType.EOF) {
			break;
		}
	}

	const tokenTypes = Array.from(new Set(tokens.map(x => csstoolsTokenToTypeWithSubIdentifiers(x))));
	tokenTypes.sort((a, b) => a.localeCompare(b));

	assert.deepEqual(
		tokenTypes,
		[
			'(-token',
			')-token',
			'[-token',
			']-token',
			'{-token',
			'}-token',
			'at-keyword-token',
			'bad-string-token',
			'bad-url-token',
			'CDC-token',
			'CDO-token',
			'colon-token',
			'comma-token',
			'comment',
			'delim-token',
			'dimension-token - integer',
			'dimension-token - number',
			'EOF-token',
			'function-token',
			'hash-token - id',
			'hash-token - unrestricted',
			'ident-token',
			'number-token - integer',
			'number-token - number',
			'percentage-token',
			'semicolon-token',
			'string-token',
			'url-token',
			'whitespace-token',
		],
	);
}

function csstoolsTokenToTypeWithSubIdentifiers(token) {
	if (token[0] === TokenType.Number) {
		return `${token[0]} - ${token[4].type}`;
	}

	if (token[0] === TokenType.Dimension) {
		return `${token[0]} - ${token[4].type}`;
	}

	if (token[0] === TokenType.Hash) {
		return `${token[0]} - ${token[4].type}`;
	}

	return token[0];
}

{
	const t = postcssTokenizer(
		{
			css: source,
		},
	);

	let tokens = [];

	while (true) {
		const token = t.nextToken();
		if (!token) {
			break;
		}

		tokens.push(token);
	}

	const tokenTypes = Array.from(new Set(tokens.map(x => x[0])));
	tokenTypes.sort((a, b) => a.localeCompare(b));

	assert.deepEqual(
		tokenTypes,
		[
			';',
			':',
			'(',
			')',
			'[',
			']',
			'{',
			'}',
			'at-word',
			'brackets',
			'comment',
			'space',
			'string',
			'word',
		],
	);
}
