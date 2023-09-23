import { ASTERISK, SOLIDUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comments
export function checkIfTwoCodePointsStartAComment(reader: CodePointReader): boolean {
	return (
		reader.codePointSource[reader.cursor] === SOLIDUS &&
		reader.codePointSource[reader.cursor + 1] === ASTERISK
	);
}
