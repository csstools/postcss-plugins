import { REVERSE_SOLIDUS } from '../code-points/code-points';
import { isNewLine } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-valid-escape
export function checkIfTwoCodePointsAreAValidEscape(reader: CodePointReader): boolean {
	return (
		// If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
		reader.codePointSource[reader.cursor] === REVERSE_SOLIDUS &&
		// Otherwise, if the second code point is a newline, return false.
		!isNewLine(reader.codePointSource[reader.cursor + 1])
	);
}
