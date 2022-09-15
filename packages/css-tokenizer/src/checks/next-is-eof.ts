import { CodePointReader } from '../interfaces/code-point-reader';

export function checkIfNextIsEOF(reader: CodePointReader): boolean {
	const peeked = reader.peekOneCodePoint();
	if (peeked === false) {
		return true;
	}

	return false;
}
