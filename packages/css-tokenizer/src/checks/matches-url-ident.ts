import { LATIN_CAPITAL_LETTER_L, LATIN_CAPITAL_LETTER_R, LATIN_CAPITAL_LETTER_U, LATIN_SMALL_LETTER_L, LATIN_SMALL_LETTER_R, LATIN_SMALL_LETTER_U } from '../code-points/code-points';

export function checkIfCodePointsMatchURLIdent(codePoints: Array<number>): boolean {
	return (
		codePoints.length === 3 &&
		(
			codePoints[0] === LATIN_SMALL_LETTER_U ||
			codePoints[0] === LATIN_CAPITAL_LETTER_U
		) &&
		(
			codePoints[1] === LATIN_SMALL_LETTER_R ||
			codePoints[1] === LATIN_CAPITAL_LETTER_R
		) &&
		(
			codePoints[2] === LATIN_SMALL_LETTER_L ||
			codePoints[2] === LATIN_CAPITAL_LETTER_L
		)
	);
}
