import { LINE_FEED, REVERSE_SOLIDUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-valid-escape
export function checkIfTwoCodePointsAreAValidEscape(ctx: Context, reader: CodePointReader): boolean {
	// If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
	if (reader.peekedOne !== REVERSE_SOLIDUS) { // "\"
		return false;
	}

	// Otherwise, if the second code point is a newline, return false.
	if (reader.peekedTwo === LINE_FEED) {
		return false;
	}

	// Otherwise, return true.
	return true;
}
