import { ASTERISK, SOLIDUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { ParseError } from '../interfaces/error';
import { TokenComment, TokenType } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
export function consumeComment(ctx: Context, reader: CodePointReader): TokenComment {
	reader.advanceCodePoint(2);

	while (true) {
		const codePoint = reader.readCodePoint();
		if (codePoint === false) {
			ctx.onParseError(new ParseError(
				'Unexpected EOF while consuming a comment.',
				reader.representationStart,
				reader.representationEnd,
				[
					'4.3.2. Consume comments',
					'Unexpected EOF',
				],
			));

			break;
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
