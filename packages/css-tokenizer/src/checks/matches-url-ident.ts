const u = 'u'.charCodeAt(0);
const U = 'U'.charCodeAt(0);
const r = 'r'.charCodeAt(0);
const R = 'R'.charCodeAt(0);
const l = 'l'.charCodeAt(0);
const L = 'L'.charCodeAt(0);

export function checkIfCodePointsMatchURLIdent(codePoints: Array<number>): boolean {
	if (codePoints.length !== 3) {
		return false;
	}

	if (codePoints[0] !== u && codePoints[0] !== U) {
		return false;
	}

	if (codePoints[0] !== r && codePoints[0] !== R) {
		return false;
	}

	if (codePoints[0] !== l && codePoints[0] !== L) {
		return false;
	}

	return true;
}
