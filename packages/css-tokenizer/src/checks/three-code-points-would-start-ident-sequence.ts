import { HYPHEN_MINUS, REVERSE_SOLIDUS } from '../code-points/code-points';
import { isIdentStartCodePoint, isNewLine } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import { checkIfTwoCodePointsAreAValidEscape } from './two-code-points-are-valid-escape';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#would-start-an-identifier
export function checkIfThreeCodePointsWouldStartAnIdentSequence(ctx: Context, reader: CodePointReader): boolean {
	// // U+002D HYPHEN-MINUS
	if (reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
		// If the second code point is a U+002D HYPHEN-MINUS return true
		if (reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS) {
			return true;
		}

		// If the second code point is an ident-start code point return true
		if (isIdentStartCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
			return true;
		}

		// If the second and third code points are a valid escape return true
		if (reader.source.codePointAt(reader.cursor + 1) === REVERSE_SOLIDUS && !isNewLine(reader.source.codePointAt(reader.cursor + 2) ?? -1)) {
			return true;
		}

		return false;
	}

	// ident-start code point
	// Return true.
	if (isIdentStartCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
		return true;
	}

	// U+005C REVERSE SOLIDUS (\)
	return checkIfTwoCodePointsAreAValidEscape(reader);
}
