import { CARRIAGE_RETURN, LINE_FEED, NULL, REPLACEMENT_CHARACTER, REVERSE_SOLIDUS } from '../code-points/code-points';
import { isNewLine, isSurrogate } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import { ParseErrorWithToken, ParseErrorMessage } from '../interfaces/error';
import type { CSSToken, TokenBadString, TokenString} from '../interfaces/token';
import { TokenType } from '../interfaces/token';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-string-token
export function consumeStringToken(ctx: Context, reader: CodePointReader): TokenBadString|TokenString {
	let result = '';

	const first = reader.readCodePoint();

	while (true) {
		const next = reader.readCodePoint();

		if (typeof next === "undefined") {
			const token: CSSToken = [TokenType.String, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];

			ctx.onParseError(new ParseErrorWithToken(
				ParseErrorMessage.UnexpectedEOFInString,
				reader.representationStart,
				reader.representationEnd,
				[
					'4.3.5. Consume a string token',
					'Unexpected EOF',
				],
				token
			));

			return token;
		}

		if (isNewLine(next)) {
			reader.unreadCodePoint();

			const token: CSSToken = [TokenType.BadString, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, undefined];

			ctx.onParseError(new ParseErrorWithToken(
				ParseErrorMessage.UnexpectedNewLineInString,
				reader.representationStart,
				(
					(
						reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN &&
						reader.source.codePointAt(reader.cursor + 1) === LINE_FEED
					) ?
						// CR LF
						reader.representationEnd + 2 :
						// LF
						reader.representationEnd + 1
				),
				[
					'4.3.5. Consume a string token',
					'Unexpected newline',
				],
				token
			));

			return token;
		}

		if (next === first) {
			return [TokenType.String, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
		}

		if (next === REVERSE_SOLIDUS) {
			if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
				continue;
			}
			if (isNewLine(reader.source.codePointAt(reader.cursor) ?? -1)) {
				if (
					reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN &&
					reader.source.codePointAt(reader.cursor + 1) === LINE_FEED
				) {
					reader.advanceCodePoint();
				}

				reader.advanceCodePoint();
				continue;
			}

			result = result + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
			continue;
		}

		if (next === NULL || isSurrogate(next)) {
			result = result + String.fromCodePoint(REPLACEMENT_CHARACTER);
			continue;
		}

		result = result + String.fromCodePoint(next);
	}
}
