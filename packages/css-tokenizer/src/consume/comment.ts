import { ASTERISK, SOLIDUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenComment, TokenType } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
export function consumeComment(ctx: Context, reader: CodePointReader): TokenComment {
	reader.readCodePoint(2);

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const codePoint = reader.readCodePoint();
		if (codePoint === false) {
			ctx.onParseError({
				message: 'Unexpected EOF while consuming a comment.',
				start: reader.representationStart,
				end: reader.representationEnd,
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

		if (reader.peekedOne === undefined) {
			continue;
		}

		if (reader.peekedOne === SOLIDUS) {
			reader.readCodePoint();
			break;
		}
	}

	return [
		TokenType.Comment,
		reader.representationString(),
		reader.representationStart,
		reader.representationEnd,
		undefined,
	];
}
