import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { RIGHT_PARENTHESIS } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-remnants-of-bad-url
export function consumeBadURL(ctx: Context, reader: CodePointReader) {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (reader.peekedOne === undefined) {
			return;
		}

		if (reader.peekedOne === RIGHT_PARENTHESIS) {
			reader.readCodePoint();
			return;
		}

		if (checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
			reader.readCodePoint();
			consumeEscapedCodePoint(ctx, reader);
			continue;
		}

		reader.readCodePoint();
		continue;
	}
}
