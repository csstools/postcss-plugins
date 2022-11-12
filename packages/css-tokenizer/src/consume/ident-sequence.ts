import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { REVERSE_SOLIDUS } from '../code-points/code-points';
import { isIdentCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-name
export function consumeIdentSequence(ctx: Context, reader: CodePointReader): Array<number> {
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

		if (peeked === REVERSE_SOLIDUS && checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
			reader.readCodePoint();
			result.push(consumeEscapedCodePoint(ctx, reader));
			continue;
		}

		return result;
	}
}
