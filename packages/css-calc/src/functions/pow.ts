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

	const result = Math.pow(aToken[4].value, bToken[4].value);

	return numberToCalculation(powNode, result);
}
