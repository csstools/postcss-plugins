import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import fs from 'fs';

{
	const source = fs.readFileSync('./test/community/open-props.css').toString();

	const t = tokenizer(
		{
			css: source,
		},
		{
			onParseError: (err) => {
				// We only expect something like open props to tokenize without parser errors.
				throw new Error(JSON.stringify(err));
			},
		},
	);

	while (true) {
		const token = t.nextToken();
		if (token[0] === TokenType.EOF) {
			break;
		}
	}
}
