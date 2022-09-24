import { HYPHEN_MINUS, LINE_FEED, REVERSE_SOLIDUS } from '../code-points/code-points';
import { isIdentStartCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { checkIfTwoCodePointsAreAValidEscape } from './two-code-points-are-valid-escape';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#would-start-an-identifier
export function checkIfThreeCodePointsWouldStartAnIdentSequence(ctx: Context, reader: CodePointReader): boolean {
	const peeked = reader.peekThreeCodePoints();
	const [first, second, third] = peeked;

	// // U+002D HYPHEN-MINUS
	if (first === HYPHEN_MINUS) {
		// If the second code point is a U+002D HYPHEN-MINUS return true
		if (second === HYPHEN_MINUS) {
			return true;
		}

		// If the second code point is an ident-start code point return true
		if (isIdentStartCodePoint(second)) {
			return true;
		}

		// If the second and third code points are a valid escape return true
		if (second === REVERSE_SOLIDUS && third !== LINE_FEED) {
			return true;
		}

		return false;
	}

	// ident-start code point
	// Return true.
	if (isIdentStartCodePoint(first)) {
		return true;
	}

	// U+005C REVERSE SOLIDUS (\)
	if (first === REVERSE_SOLIDUS) {
		// If the first and second code points are a valid escape, return true.
		// Otherwise, return false.
		return checkIfTwoCodePointsAreAValidEscape(ctx, reader);
	}

	// anything else
	// Return false.
	return false;
}
