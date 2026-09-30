import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isTokenNumber } from '@csstools/css-tokenizer';
import { numberToCalculation } from './result-to-calculation';
import { twoOfSameNumeric } from '../util/kind-of-number';

export function solvePow(powNode: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	const bToken = b.value;
	if (!isTokenNumber(aToken)) {
		return -1;
	}

	if (!twoOfSameNumeric(aToken, bToken)) {
		return -1;
	}

	// https://drafts.csswg.org/css-values-4/#exponent-infinities
	// NaN is infectious, forcing the function to return NaN if any argument calculation is NaN.
	// Note: `Math.pow(NaN, 0)` returns `1` in JS, but CSS requires NaN.
	if (Number.isNaN(aToken[4].value) || Number.isNaN(bToken[4].value)) {
		return numberToCalculation(powNode, Number.NaN);
	}

	const result = Math.pow(aToken[4].value, bToken[4].value);

	return numberToCalculation(powNode, result);
}
