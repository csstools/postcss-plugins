import { LATIN_CAPITAL_LETTER_L, LATIN_CAPITAL_LETTER_R, LATIN_CAPITAL_LETTER_U, LATIN_SMALL_LETTER_L, LATIN_SMALL_LETTER_R, LATIN_SMALL_LETTER_U } from '../code-points/code-points';
import { Context } from '../interfaces/context';

export function checkIfCodePointsMatchURLIdent(ctx: Context, codePoints: Array<number>): boolean {
	if (codePoints.length !== 3) {
		return false;
	}

	if (codePoints[0] !== LATIN_SMALL_LETTER_U && codePoints[0] !== LATIN_CAPITAL_LETTER_U) {
		return false;
	}

	if (codePoints[1] !== LATIN_SMALL_LETTER_R && codePoints[1] !== LATIN_CAPITAL_LETTER_R) {
		return false;
	}

	if (codePoints[2] !== LATIN_SMALL_LETTER_L && codePoints[2] !== LATIN_CAPITAL_LETTER_L) {
		return false;
	}

	return true;
}
