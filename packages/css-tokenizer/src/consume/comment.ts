import { ASTERISK, SOLIDUS } from '../code-points/code-points';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import { ParseErrorMessage, ParseErrorWithToken } from '../interfaces/error';
import type { CSSToken, TokenComment} from '../interfaces/token';
import { TokenType } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
export function consumeComment(ctx: Context, reader: CodePointReader): TokenComment {
	reader.advanceCodePoint(2);

	while (true) {
		const codePoint = reader.readCodePoint();
		if (typeof codePoint === "undefined") {
			const token: CSSToken = [
				TokenType.Comment,
				reader.source.slice(reader.representationStart, reader.representationEnd + 1),
				reader.representationStart,
				reader.representationEnd,
				undefined,
			];

			ctx.onParseError(new ParseErrorWithToken(
				ParseErrorMessage.UnexpectedEOFInComment,
				reader.representationStart,
				reader.representationEnd,
				[
					'4.3.2. Consume comments',
					'Unexpected EOF',
				],
				token
			));

			return token;
		}

		if (codePoint !== ASTERISK) {
			continue;
		}

		if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
			continue;
		}

		if (reader.source.codePointAt(reader.cursor) === SOLIDUS) {
			reader.advanceCodePoint();
			break;
		}
	}

	return [
		TokenType.Comment,
		reader.source.slice(reader.representationStart, reader.representationEnd + 1),
		reader.representationStart,
		reader.representationEnd,
		undefined,
	];
}
