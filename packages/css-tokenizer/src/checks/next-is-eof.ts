import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';

export function checkIfNextIsEOF(ctx: Context, reader: CodePointReader): boolean {
	if (reader.peekedOne === undefined) {
		return true;
	}

	return false;
}
