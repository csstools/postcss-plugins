import { GREATER_THAN_SIGN, HYPHEN_MINUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function checkIfThreeCodePointsWouldStartCDC(ctx: Context, reader: CodePointReader): boolean {
	const peeked = reader.peekThreeCodePoints();
	const [first, second, third] = peeked;

	return first === HYPHEN_MINUS && second === HYPHEN_MINUS && third === GREATER_THAN_SIGN;
}
