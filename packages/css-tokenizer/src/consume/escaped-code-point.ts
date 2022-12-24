import { MAXIMUM_ALLOWED_CODEPOINT, REPLACEMENT_CHARACTER } from '../code-points/code-points';
import { isHexDigitCodePoint, isSurrogate, isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-escaped-code-point
export function consumeEscapedCodePoint(ctx: Context, reader: CodePointReader): number {
	const codePoint = reader.readCodePoint();
	if (codePoint === false) {
		ctx.onParseError({
			message: 'Unexpected EOF while consuming an escaped code point.',
			start: reader.representationStart,
			end: reader.representationEnd,
			state: [
				'4.3.7. Consume an escaped code point',
				'Unexpected EOF',
			],
		});

		return REPLACEMENT_CHARACTER;
	}

	if (isHexDigitCodePoint(codePoint)) {
		const hexSequence: Array<number> = [codePoint];

		while ((typeof reader.peekedOne !== 'undefined') && isHexDigitCodePoint(reader.peekedOne) && hexSequence.length < 6) {
			hexSequence.push(reader.peekedOne);
			reader.readCodePoint();
		}

		if (isWhitespace(reader.peekedOne)) {
			reader.readCodePoint();
		}

		const codePointLiteral = parseInt(String.fromCharCode(...hexSequence), 16);
		if (codePointLiteral === 0) {
			return REPLACEMENT_CHARACTER;
		}
		if (isSurrogate(codePointLiteral)) {
			return REPLACEMENT_CHARACTER;
		}
		if (codePointLiteral > MAXIMUM_ALLOWED_CODEPOINT) {
			return REPLACEMENT_CHARACTER;
		}

		return codePointLiteral;
	}

	return codePoint;
}
