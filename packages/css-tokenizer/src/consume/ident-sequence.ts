import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { isIdentCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-name
export function consumeIdentSequence(ctx: Context, reader: CodePointReader): Array<number> {
	const result: Array<number> = [];

	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (isIdentCodePoint(reader.codePointSource[reader.cursor])) {
			result.push(reader.codePointSource[reader.cursor]);
			reader.advanceCodePoint();
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
