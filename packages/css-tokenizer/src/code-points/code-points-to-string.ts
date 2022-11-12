export function codePointsToString(codePoints: Array<number>): string {
	let result = '';

	for (let i = 0; i < codePoints.length; i++) {
		result += String.fromCharCode(codePoints[i]);
	}

	return result;
}
