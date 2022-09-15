import { LINE_FEED, REVERSE_SOLIDUS } from '../codepoints/codepoints';
import { CodePointReader } from '../interfaces/code-point-reader';

export function checkIfTwoCodePointsAreAValidEscape(reader: CodePointReader): boolean {
	const peeked = reader.peekTwoCodePoints();
	if (peeked === false) {
		return false;
	}

	if (peeked[0] !== REVERSE_SOLIDUS) { // "\"
		return false;
	}

	if (peeked[1] === LINE_FEED) {
		return false;
	}

	return true;
}
