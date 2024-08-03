import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { isIdentCodePoint } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-name
export function consumeIdentSequence(ctx: Context, reader: CodePointReader): Array<number> {
	const result: Array<number> = [];

	while (true) {
		const codePoint = reader.source.codePointAt(reader.cursor);
		if (isIdentCodePoint(codePoint)) {
			result.push(codePoint);
			reader.advanceCodePoint(1 + +(codePoint > 0xffff));
			continue;
		}

		if (checkIfTwoCodePointsAreAValidEscape(reader)) {
			reader.advanceCodePoint();
			result.push(consumeEscapedCodePoint(ctx, reader));
			continue;
		}

		return result;
	}
}
