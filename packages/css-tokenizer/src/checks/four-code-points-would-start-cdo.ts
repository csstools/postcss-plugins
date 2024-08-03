import { EXCLAMATION_MARK, HYPHEN_MINUS, LESS_THAN_SIGN } from '../code-points/code-points';
import type { CodePointReader } from '../interfaces/code-point-reader';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function checkIfFourCodePointsWouldStartCDO(reader: CodePointReader): boolean {
	return reader.codePointSource[reader.cursor] === LESS_THAN_SIGN && reader.codePointSource[reader.cursor + 1] === EXCLAMATION_MARK && reader.codePointSource[reader.cursor + 2] === HYPHEN_MINUS && reader.codePointSource[reader.cursor + 3] === HYPHEN_MINUS;
}
