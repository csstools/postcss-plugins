import { Context } from '../interfaces/context';

const u = 'u'.charCodeAt(0);
const U = 'U'.charCodeAt(0);
const r = 'r'.charCodeAt(0);
const R = 'R'.charCodeAt(0);
const l = 'l'.charCodeAt(0);
const L = 'L'.charCodeAt(0);

export function checkIfCodePointsMatchURLIdent(ctx: Context, codePoints: Array<number>): boolean {
	if (codePoints.length !== 3) {
		return false;
	}

	if (codePoints[0] !== u && codePoints[0] !== U) {
		return false;
	}

	if (codePoints[1] !== r && codePoints[1] !== R) {
		return false;
	}

	if (codePoints[2] !== l && codePoints[2] !== L) {
		return false;
	}

	return true;
}
