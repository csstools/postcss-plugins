import { ASTERISK, SOLIDUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { ParseError, ParseErrorMessage } from '../interfaces/error';
import { CSSToken, TokenComment, TokenType } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
export function consumeComment(ctx: Context, reader: CodePointReader): TokenComment {
	reader.advanceCodePoint(2);

	while (true) {
		const codePoint = reader.readCodePoint();
		if (codePoint === false) {
			const token: CSSToken = [
				TokenType.Comment,
				reader.source.slice(reader.representationStart, reader.representationEnd + 1),
				reader.representationStart,
				reader.representationEnd,
				undefined,
			];

			ctx.onParseError(new ParseError(
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

		if (reader.codePointSource[reader.cursor] === undefined) {
			continue;
		}

		if (reader.codePointSource[reader.cursor] === SOLIDUS) {
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
