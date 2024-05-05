import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';
import { twoOfSameNumeric } from '../util/kind-of-number';
import { isTokenNumeric } from '@csstools/css-tokenizer';

export function solveRound(roundNode: FunctionNode, roundingStrategy: string, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isTokenNumeric(aToken)) {
		return -1;
	}

	const bToken = convertUnit(aToken, b.value);
	if (!twoOfSameNumeric(aToken, bToken)) {
		return -1;
	}

	let result;
	if (bToken[4].value === 0) {
		result = Number.NaN;
	} else if (!Number.isFinite(aToken[4].value) && !Number.isFinite(bToken[4].value)) {
		result = Number.NaN;
	} else if (!Number.isFinite(aToken[4].value) && Number.isFinite(bToken[4].value)) {
		result = aToken[4].value;
	} else if (Number.isFinite(aToken[4].value) && !Number.isFinite(bToken[4].value)) {
		switch (roundingStrategy) {
			case 'down':
				if (aToken[4].value < 0) {
					result = -Infinity;
				} else if (Object.is(-0, aToken[4].value * 0)) {
					result = -0;
				} else {
					result = +0;
				}
				break;
			case 'up':
				if (aToken[4].value > 0) {
					result = +Infinity;
				} else if (Object.is(+0, aToken[4].value * 0)) {
					result = +0;
				} else {
					result = -0;
				}
				break;
			case 'to-zero':
			case 'nearest':
			default: {
				if (Object.is(+0, aToken[4].value * 0)) {
					result = +0;
				} else {
					result = -0;
				}
			}
		}
	} else if (!Number.isFinite(bToken[4].value)) {
		result = aToken[4].value;
	} else {
		switch (roundingStrategy) {
			case 'down':
				result = Math.floor(aToken[4].value / bToken[4].value) * bToken[4].value;
				break;
			case 'up':
				result = Math.ceil(aToken[4].value / bToken[4].value) * bToken[4].value;
				break;
			case 'to-zero':
				result = Math.trunc(aToken[4].value / bToken[4].value) * bToken[4].value;
				break;
			case 'nearest':
			default: {
				let down = Math.floor(aToken[4].value / bToken[4].value) * bToken[4].value;
				let up = Math.ceil(aToken[4].value / bToken[4].value) * bToken[4].value;
				if (down > up) {
					const temp = down;
					down = up;
					up = temp;
				}

				const downDiff = Math.abs(aToken[4].value - down);
				const upDiff = Math.abs(aToken[4].value - up);

				if (downDiff === upDiff) {
					result = up;
				} else if (downDiff < upDiff) {
					result = down;
				} else {
					result = up;
				}

				break;
			}
		}
	}

	return resultToCalculation(roundNode, aToken, result);
}
