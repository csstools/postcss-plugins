import { EXCLAMATION_MARK, HYPHEN_MINUS, LESS_THAN_SIGN } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function checkIfFourCodePointsWouldStartCDO(ctx: Context, reader: CodePointReader): boolean {
	return reader.peekedOne === LESS_THAN_SIGN && reader.peekedTwo === EXCLAMATION_MARK && reader.peekedThree === HYPHEN_MINUS && reader.peekedFour === HYPHEN_MINUS;
}
