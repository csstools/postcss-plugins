import { DIGIT_ZERO, HYPHEN_MINUS, LATIN_CAPITAL_LETTER_F, QUESTION_MARK } from '../code-points/code-points';
import { isHexDigitCodePoint } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import type { TokenUnicodeRange } from '../interfaces/token';
import { TokenType } from '../interfaces/token';

// https://drafts.csswg.org/css-syntax/#starts-a-unicode-range
export function consumeUnicodeRangeToken(ctx: Context, reader: CodePointReader): TokenUnicodeRange {
	// 1. Consume the next two input code points and discard them.
	reader.advanceCodePoint(2);

	const firstSegment: Array<number> = [];
	const secondSegment: Array<number> = [];

	// 2. Consume as many hex digits as possible,
	// but no more than 6.
	let codePoint: number | undefined;
	while (
		(typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined") &&
		firstSegment.length < 6 &&
		isHexDigitCodePoint(codePoint)
	) {
		firstSegment.push(codePoint);
		reader.advanceCodePoint();
	}

	// 2. If less than 6 hex digits were consumed,
	// consume as many U+003F QUESTION MARK (?) code points as possible,
	// but no more than enough to make the total of hex digits and U+003F QUESTION MARK (?) code points equal to 6.
	while (
		(typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined") &&
		firstSegment.length < 6 &&
		codePoint === QUESTION_MARK
	) {
		if (secondSegment.length === 0) {
			secondSegment.push(...firstSegment);
		}

		// 3. If first segment contains any question mark code points, then:
		// 3.1 Replace the question marks in first segment with U+0030 DIGIT ZERO (0) code points.
		firstSegment.push(DIGIT_ZERO);
		// 3.2.Replace the question marks in first segment with U+0046 LATIN CAPITAL LETTER F (F) code points.
		secondSegment.push(LATIN_CAPITAL_LETTER_F);
		reader.advanceCodePoint();
	}

	if (!secondSegment.length) {
		// 5. If the next 2 input code points are U+002D HYPHEN-MINUS (-) followed by a hex digit
		if (
			reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS &&
			isHexDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)
		) {
			// 5.1. Consume the next input code point.
			reader.advanceCodePoint();

			// 5.2 Consume as many hex digits as possible,
			// but no more than 6.
			while (
				(typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined") &&
				secondSegment.length < 6 &&
				isHexDigitCodePoint(codePoint)
			) {
				secondSegment.push(codePoint);
				reader.advanceCodePoint();
			}
		}
	}

	if (!secondSegment.length) {
		// Interpret the consumed code points as a hexadecimal number.
		const startOfRange = parseInt(String.fromCodePoint(...firstSegment), 16);

		// Return a new <unicode-range-token> both starting and ending at start of range.
		return [
			TokenType.UnicodeRange,
			reader.source.slice(reader.representationStart, reader.representationEnd + 1),
			reader.representationStart,
			reader.representationEnd,
			{
				startOfRange: startOfRange,
				endOfRange: startOfRange,
			},
		];
	}

	// Interpret the consumed code points as a hexadecimal number.
	const startOfRange = parseInt(String.fromCodePoint(...firstSegment), 16);
	const endOfRange = parseInt(String.fromCodePoint(...secondSegment), 16);

	// Return a new <unicode-range-token> starting at start of range and ending at end of range.
	return [
		TokenType.UnicodeRange,
		reader.source.slice(reader.representationStart, reader.representationEnd + 1),
		reader.representationStart,
		reader.representationEnd,
		{
			startOfRange: startOfRange,
			endOfRange: endOfRange,
		},
	];
}
