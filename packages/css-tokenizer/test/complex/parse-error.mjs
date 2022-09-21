import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import assert from 'assert';

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

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const token = t.nextToken();
		if (token[0] === TokenType.EOF) {
			break;
		}
	}

	assert.deepEqual(
		parseErrors,
		[
			{
				message: 'Unexpected EOF while consuming an escaped code point.',
				start: 0,
				end: 0,
				state: ['4.3.7. Consume an escaped code point', 'Unexpected EOF'],
			},
		],
	);
}
