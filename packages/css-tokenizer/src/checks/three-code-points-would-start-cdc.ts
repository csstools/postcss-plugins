import { GREATER_THAN_SIGN, HYPHEN_MINUS } from '../code-points/code-points';
import type { CodePointReader } from '../interfaces/code-point-reader';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function checkIfThreeCodePointsWouldStartCDC(reader: CodePointReader): boolean {
	return reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 2) === GREATER_THAN_SIGN;
}
