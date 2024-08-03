import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import fs from 'node:fs';

{
	const source = fs.readFileSync('./test/community/bootstrap.css').toString();

	const t = tokenizer(
		{
			css: source,
		},
		{
			onParseError: (err) => {
				// We only expect something like bootstrap to tokenize without parser errors.
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
