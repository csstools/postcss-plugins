import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { RIGHT_PARENTHESIS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-remnants-of-bad-url
export function consumeBadURL(reader: CodePointReader) {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return;
		}

		if (peeked === RIGHT_PARENTHESIS) {
			reader.readCodePoint();
			return;
		}

		if (checkIfTwoCodePointsAreAValidEscape(reader)) {
			reader.readCodePoint();
			consumeEscapedCodePoint(reader);
			continue;
		}

		reader.readCodePoint();
		continue;
	}
}
