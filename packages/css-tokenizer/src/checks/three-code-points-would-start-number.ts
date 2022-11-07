import { FULL_STOP, HYPHEN_MINUS, PLUS_SIGN } from '../code-points/code-points';
import { isDigitCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-number
export function checkIfThreeCodePointsWouldStartANumber(ctx: Context, reader: CodePointReader): boolean {
	const peeked = reader.peekThreeCodePoints();
	const [first, second, third] = peeked;

	if (first === PLUS_SIGN || first === HYPHEN_MINUS) { // U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-)
		// If the second code point is a digit, return true.
		if (isDigitCodePoint(second)) {
			return true;
		}

		// Otherwise, if the second code point is a U+002E FULL STOP (.)
		if (second === FULL_STOP) {
			// and the third code point is a digit, return true.
			return isDigitCodePoint(third);
		}

		// Otherwise, return false.
		return false;

	} else if (first === FULL_STOP) { // U+002E FULL STOP (.)
		// If the second code point is a digit, return true.
		// Otherwise, return false.
		return isDigitCodePoint(second);

	} else if (isDigitCodePoint(first)) { // digit
		// Return true.
		return true;
	}

	// anything else
	// Return false.
	return false;
}
