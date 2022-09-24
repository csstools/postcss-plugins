import { ASTERISK, SOLIDUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenComment, TokenType } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
export function consumeComment(ctx: Context, reader: CodePointReader): TokenComment {
	reader.readCodePoint();
	reader.readCodePoint();

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const codePoint = reader.readCodePoint();
		if (codePoint === false) {
			const representation = reader.representation();
			ctx.onParseError({
				message: 'Unexpected EOF while consuming a comment.',
				start: representation[0],
				end: representation[1],
				state: [
					'4.3.2. Consume comments',
					'Unexpected EOF',
				],
			});

			break;
		}

		if (codePoint !== ASTERISK) {
			continue;
		}

		const close = reader.peekOneCodePoint();
		if (close === false) {
			continue;
		}

		if (close === SOLIDUS) {
			reader.readCodePoint();
			break;
		}
	}

	return [
		TokenType.Comment,
		reader.representationString(),
		...reader.representation(),
		undefined,
	];
}
