import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import fs from 'fs';

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

// eslint-disable-next-line no-constant-condition
while (true) {
	const t = tokenizer(
		{
			css: source,
		},
		{
			commentsAreTokens: true,
			onParseError: () => {
				// noop
			},
		},
	);

	// eslint-disable-next-line no-constant-condition
	while (t.nextToken()[0] !== TokenType.EOF) {
		// noop
	}
}
