import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { isIdentCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { consumeEscapedCodePoint } from './consume-escaped-code-pooint';

export function consumeIdentSequence(reader: CodePointReader): Array<number> {
	const result = [];

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return result;
		}

		if (isIdentCodePoint(peeked)) {
			reader.readCodePoint();
			result.push(peeked);
			continue;
		}

		if (checkIfTwoCodePointsAreAValidEscape(reader)) {
			result.push(consumeEscapedCodePoint(reader));
			continue;
		}

		return result;
	}
}
