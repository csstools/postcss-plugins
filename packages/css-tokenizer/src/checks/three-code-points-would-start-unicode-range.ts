import { LATIN_CAPITAL_LETTER_U, LATIN_SMALL_LETTER_U, PLUS_SIGN, QUESTION_MARK } from '../code-points/code-points';
import { isHexDigitCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://drafts.csswg.org/css-syntax/#starts-a-unicode-range
export function checkIfThreeCodePointsWouldStartAUnicodeRange(ctx: Context, reader: CodePointReader): boolean {
	if (
		// The first code point is either U+0055 LATIN CAPITAL LETTER U (U) or U+0075 LATIN SMALL LETTER U (u)
		(
			reader.codePointSource[reader.cursor] === LATIN_SMALL_LETTER_U ||
			reader.codePointSource[reader.cursor] === LATIN_CAPITAL_LETTER_U
		) &&
		// The second code point is U+002B PLUS SIGN (+).
		reader.codePointSource[reader.cursor + 1] === PLUS_SIGN &&
		// The third code point is either U+003F QUESTION MARK (?) or a hex digit
		(
			reader.codePointSource[reader.cursor + 2] === QUESTION_MARK ||
			isHexDigitCodePoint(reader.codePointSource[reader.cursor + 2])
		)
	) {
		// then return true.
		return true;
	}

	// Otherwise return false.
	return false;
}
