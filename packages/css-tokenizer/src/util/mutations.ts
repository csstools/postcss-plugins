import { HYPHEN_MINUS } from '../code-points/code-points';
import { isIdentCodePoint, isIdentStartCodePoint } from '../code-points/ranges';
import { TokenIdent } from '../interfaces/token';

export function mutateIdent(ident: TokenIdent, newValue: string): void {
	let result = '';

	const codePoints: Array<number> = [];

	{
		let index = 0;
		let codePoint: number | undefined;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			codePoint = newValue.codePointAt(index++);
			if (codePoint === undefined) {
				break;
			}

			codePoints.push(codePoint);
		}
	}

	let remainderStartIndex = 0;

	if (codePoints[0] === HYPHEN_MINUS && codePoints[1] === HYPHEN_MINUS) {
		result = '--';
		remainderStartIndex = 2;
	} else if (codePoints[0] === HYPHEN_MINUS && codePoints[1]) {
		result = '-';
		remainderStartIndex = 2;

		if (!isIdentStartCodePoint(codePoints[1])) {
			result += `\\${codePoints[1].toString(16)} `;
		} else {
			result += newValue[1];
		}
	} else if (isIdentStartCodePoint(codePoints[0])) {
		result = newValue[0];
		remainderStartIndex = 1;
	} else {
		result = `\\${codePoints[0].toString(16)} `;
		remainderStartIndex = 1;
	}

	for (let i = remainderStartIndex; i < codePoints.length; i++) {
		if (isIdentCodePoint(codePoints[i])) {
			result += newValue[i];
			continue;
		}

		result += `\\${codePoints[i].toString(16)} `;
	}

	ident[1] = result;
	ident[4].value = newValue;
}
