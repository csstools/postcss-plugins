import { ASTERISK, SOLIDUS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comments
export function checkIfTwoCodePointsStartAComment(ctx: Context, reader: CodePointReader): boolean {
	const peeked = reader.peekTwoCodePoints();
	if (peeked[0] !== SOLIDUS) {
		return false;
	}

	if (peeked[1] !== ASTERISK) {
		return false;
	}

	// Otherwise, return true.
	return true;
}
