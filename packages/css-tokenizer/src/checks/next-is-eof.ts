import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

export function checkIfNextIsEOF(ctx: Context, reader: CodePointReader): boolean {
	const peeked = reader.peekOneCodePoint();
	if (peeked === false) {
		return true;
	}

	return false;
}
