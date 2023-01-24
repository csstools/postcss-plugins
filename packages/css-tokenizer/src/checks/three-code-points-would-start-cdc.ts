import { GREATER_THAN_SIGN, HYPHEN_MINUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function checkIfThreeCodePointsWouldStartCDC(ctx: Context, reader: CodePointReader): boolean {
	return reader.codePointSource[reader.cursor] === HYPHEN_MINUS && reader.codePointSource[reader.cursor+1] === HYPHEN_MINUS && reader.codePointSource[reader.cursor + 2] === GREATER_THAN_SIGN;
}
