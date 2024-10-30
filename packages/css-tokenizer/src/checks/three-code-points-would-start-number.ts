import { FULL_STOP, HYPHEN_MINUS, PLUS_SIGN } from '../code-points/code-points';
import { isDigitCodePoint } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-number
export function checkIfThreeCodePointsWouldStartANumber(reader: CodePointReader): boolean {
	if (reader.source.codePointAt(reader.cursor) === PLUS_SIGN || reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) { // U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-)
		// If the second code point is a digit, return true.
		if (isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
			return true;
		}

		// Otherwise, if the second code point is a U+002E FULL STOP (.)
		if (reader.source.codePointAt(reader.cursor + 1) === FULL_STOP) {
			// and the third code point is a digit, return true.
			return isDigitCodePoint(reader.source.codePointAt(reader.cursor + 2) ?? -1);
		}

		// Otherwise, return false.
		return false;

	} else if (reader.source.codePointAt(reader.cursor) === FULL_STOP) { // U+002E FULL STOP (.)
		// If the second code point is a digit, return true.
		// Otherwise, return false.
		return isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1);
	}

	return isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1); // digit
}
