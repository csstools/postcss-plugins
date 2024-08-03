import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { RIGHT_PARENTHESIS } from '../code-points/code-points';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-remnants-of-bad-url
export function consumeBadURL(ctx: Context, reader: CodePointReader): void {
	while (true) {
		const codePoint = reader.source.codePointAt(reader.cursor);
		if (typeof codePoint === "undefined") {
			return;
		}

		if (codePoint === RIGHT_PARENTHESIS) {
			reader.advanceCodePoint();
			return;
		}

		if (checkIfTwoCodePointsAreAValidEscape(reader)) {
			reader.advanceCodePoint();
			consumeEscapedCodePoint(ctx, reader);
			continue;
		}

		reader.advanceCodePoint();
		continue;
	}
}
