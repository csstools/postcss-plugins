import { CARRIAGE_RETURN, LINE_FEED, MAXIMUM_ALLOWED_CODEPOINT, REPLACEMENT_CHARACTER } from '../code-points/code-points';
import { isHexDigitCodePoint, isSurrogate, isWhitespace } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import { ParseError, ParseErrorMessage } from '../interfaces/error';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-escaped-code-point
export function consumeEscapedCodePoint(ctx: Context, reader: CodePointReader): number {
	const codePoint = reader.readCodePoint();
	if (typeof codePoint === "undefined") {
		ctx.onParseError(new ParseError(
			ParseErrorMessage.UnexpectedEOFInEscapedCodePoint,
			reader.representationStart,
			reader.representationEnd,
			[
				'4.3.7. Consume an escaped code point',
				'Unexpected EOF',
			],
		));

		return REPLACEMENT_CHARACTER;
	}

	if (isHexDigitCodePoint(codePoint)) {
		const hexSequence: Array<number> = [codePoint];

		let nextCodePoint: number | undefined;
		while ((typeof (nextCodePoint = reader.source.codePointAt(reader.cursor)) !== "undefined") && isHexDigitCodePoint(nextCodePoint) && hexSequence.length < 6) {
			hexSequence.push(nextCodePoint);
			reader.advanceCodePoint();
		}

		if (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
			if (
				reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN &&
				reader.source.codePointAt(reader.cursor + 1) === LINE_FEED
			) {
				reader.advanceCodePoint();
			}

			reader.advanceCodePoint();
		}

		const codePointLiteral = parseInt(String.fromCodePoint(...hexSequence), 16);
		if (codePointLiteral === 0 || isSurrogate(codePointLiteral)) {
			return REPLACEMENT_CHARACTER;
		}
		if (codePointLiteral > MAXIMUM_ALLOWED_CODEPOINT) {
			return REPLACEMENT_CHARACTER;
		}

		return codePointLiteral;
	}

	if (codePoint === 0 || isSurrogate(codePoint)) {
		return REPLACEMENT_CHARACTER;
	}

	return codePoint;
}
