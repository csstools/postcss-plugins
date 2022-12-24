import { FULL_STOP, HYPHEN_MINUS, PLUS_SIGN } from '../code-points/code-points';
import { isDigitCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-number
export function checkIfThreeCodePointsWouldStartANumber(ctx: Context, reader: CodePointReader): boolean {
	if (reader.peekedOne === PLUS_SIGN || reader.peekedOne === HYPHEN_MINUS) { // U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-)
		// If the second code point is a digit, return true.
		if (isDigitCodePoint(reader.peekedTwo)) {
			return true;
		}

		// Otherwise, if the second code point is a U+002E FULL STOP (.)
		if (reader.peekedTwo === FULL_STOP) {
			// and the third code point is a digit, return true.
			return isDigitCodePoint(reader.peekedThree);
		}

		// Otherwise, return false.
		return false;

	} else if (reader.peekedOne === FULL_STOP) { // U+002E FULL STOP (.)
		// If the second code point is a digit, return true.
		// Otherwise, return false.
		return isDigitCodePoint(reader.peekedTwo);

	} else if (isDigitCodePoint(reader.peekedOne)) { // digit
		// Return true.
		return true;
	}

	// anything else
	// Return false.
	return false;
}
