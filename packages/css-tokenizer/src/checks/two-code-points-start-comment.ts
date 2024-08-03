import { ASTERISK, SOLIDUS } from '../code-points/code-points';
import type { CodePointReader } from '../interfaces/code-point-reader';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comments
export function checkIfTwoCodePointsStartAComment(reader: CodePointReader): boolean {
	return (
		reader.source.codePointAt(reader.cursor) === SOLIDUS &&
		reader.source.codePointAt(reader.cursor + 1) === ASTERISK
	);
}
