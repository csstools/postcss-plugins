import { EXCLAMATION_MARK, HYPHEN_MINUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function checkIfThreeCodePointsWouldStartCDO(reader: CodePointReader): boolean {
	const peeked = reader.peekThreeCodePoints();
	const [first, second, third] = peeked;

	return first === EXCLAMATION_MARK && second === HYPHEN_MINUS && third === HYPHEN_MINUS;
}
