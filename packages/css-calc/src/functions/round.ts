import { solve, type Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';
import { twoOfSameNumeric } from '../util/kind-of-number';
import { isTokenDimension, isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';
import type { conversionOptions } from '../options';
import { snapAsBorderWidth } from '../util/snap-to-border-width';

export function solveRound(roundNode: FunctionNode, roundingStrategy: string, a: TokenNode, b: TokenNode, options: conversionOptions): Calculation | -1 {
	const aToken = a.value;
	if (!isTokenNumeric(aToken)) {
		return -1;
	}

	if (roundingStrategy === 'line-width' && !isTokenDimension(aToken)) {
		return -1;
	}

	if (!options.rawPercentages && isTokenPercentage(aToken)) {
		return -1;
	}

	const bToken = convertUnit(aToken, b.value);
	if (!twoOfSameNumeric(aToken, bToken)) {
		return -1;
	}

	let result;
	// https://drafts.csswg.org/css-values-4/#round-infinities
	if (bToken[4].value === 0) {
		// In round(A, B), if B is 0, the result is NaN.
		result = Number.NaN;
	} else if (!Number.isFinite(aToken[4].value) && !Number.isFinite(bToken[4].value)) {
		// If A and B are both infinite, the result is NaN.
		result = Number.NaN;
	} else if (!Number.isFinite(aToken[4].value) && Number.isFinite(bToken[4].value)) {
		// If A is infinite but B is finite, the result is the same infinity.
		result = aToken[4].value;
	} else if (Number.isFinite(aToken[4].value) && !Number.isFinite(bToken[4].value)) {
		// If A is finite but B is infinite, the result depends on the <rounding-strategy> and the sign of A:
		switch (roundingStrategy) {
			// If A is negative (not zero), return −∞. If A is 0⁻, return 0⁻. Otherwise, return 0⁺.
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
				// If A is positive (not zero), return +∞. If A is 0⁺, return 0⁺. Otherwise, return 0⁻.
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
			case 'line-width':
			default: {
				// If A is positive or 0⁺, return 0⁺. Otherwise, return 0⁻.
				if (Object.is(+0, aToken[4].value * 0)) {
					result = +0;
				} else {
					result = -0;
				}
			}
		}
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
			case 'line-width':
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

				if (roundingStrategy === 'line-width' && aToken[4].value > 0 && (up === 0 || down === 0)) {
					result = up !== 0 ? up : down;
				} else if (downDiff === upDiff) {
					result = up;
				} else if (downDiff < upDiff) {
					result = down;
				} else {
					result = up;
				}

				if (roundingStrategy === 'line-width') {
					const solved = solve(resultToCalculation(roundNode, aToken, result), options);
					if (solved === -1) {
						return -1;
					}

					return snapAsBorderWidth(roundNode, solved.value, options);
				}

				break;
			}
		}
	}

	return resultToCalculation(roundNode, aToken, result);
}
