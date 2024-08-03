import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import assert from 'node:assert';

{
	const parseErrors = [];
	const t = tokenizer(
		{
			css: '\\',
		},
		{
			onParseError: (err) => {
				parseErrors.push(err);
			},
		},
	);

	while (true) {
		const token = t.nextToken();
		if (token[0] === TokenType.EOF) {
			break;
		}
	}

	assert.deepEqual(
		parseErrors.map((x) => {
			return {
				message: x.message,
				sourceStart: x.sourceStart,
				sourceEnd: x.sourceEnd,
				parserState: x.parserState,
			};
		}),
		[
			{
				message: 'Unexpected EOF while consuming an escaped code point.',
				sourceStart: 0,
				sourceEnd: 0,
				parserState: ['4.3.7. Consume an escaped code point', 'Unexpected EOF'],
			},
		],
	);
}
