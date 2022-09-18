import { LINE_FEED, REVERSE_SOLIDUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-valid-escape
export function checkIfTwoCodePointsAreAValidEscape(reader: CodePointReader): boolean {
	const peeked = reader.peekTwoCodePoints();
	// If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
	if (peeked[0] !== REVERSE_SOLIDUS) { // "\"
		return false;
	}

	// Otherwise, if the second code point is a newline, return false.
	if (peeked[1] === LINE_FEED) {
		return false;
	}

	// Otherwise, return true.
	return true;
}
