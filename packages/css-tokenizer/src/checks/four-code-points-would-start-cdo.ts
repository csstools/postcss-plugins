import { EXCLAMATION_MARK, HYPHEN_MINUS, LESS_THAN_SIGN } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function checkIfFourCodePointsWouldStartCDO(ctx: Context, reader: CodePointReader): boolean {
	const peeked = reader.peekFourCodePoints();
	const [first, second, third, fourth] = peeked;

	return first === LESS_THAN_SIGN && second === EXCLAMATION_MARK && third === HYPHEN_MINUS && fourth === HYPHEN_MINUS;
}
