import { REVERSE_SOLIDUS } from '../code-points/code-points';
import { isNewLine } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { ParseError } from '../interfaces/error';
import { TokenBadString, TokenString, TokenType } from '../interfaces/token';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-string-token
export function consumeStringToken(ctx: Context, reader: CodePointReader): TokenBadString|TokenString {
	let result = '';

	const first = reader.readCodePoint();

	while (true) {
		const next = reader.readCodePoint();
		if (next === false) {
			ctx.onParseError(new ParseError(
				'Unexpected EOF while consuming a string token.',
				reader.representationStart,
				reader.representationEnd,
				[
					'4.3.5. Consume a string token',
					'Unexpected EOF',
				],
			));

			return [TokenType.String, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
		}

		if (isNewLine(next)) {
			ctx.onParseError(new ParseError(
				'Unexpected newline while consuming a string token.',
				reader.representationStart,
				reader.representationEnd,
				[
					'4.3.5. Consume a string token',
					'Unexpected newline',
				],
			));

			reader.unreadCodePoint();
			return [TokenType.BadString, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, undefined];
		}

		if (next === first) {
			return [TokenType.String, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
		}

		if (next === REVERSE_SOLIDUS) {
			if (reader.codePointSource[reader.cursor] === undefined) {
				continue;
			}

			if (isNewLine(reader.codePointSource[reader.cursor])) {
				if (
					reader.codePointSource[reader.cursor] === 0x000d &&
					reader.codePointSource[reader.cursor + 1] === 0x000a
				) {
					reader.advanceCodePoint();
				}

				reader.advanceCodePoint();
				continue;
			}

			result = result + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
			continue;
		}

		result = result + String.fromCodePoint(next);
	}
}
