import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isTokenNumber } from '@csstools/css-tokenizer';
import { dimensionToCalculation } from './result-to-calculation';

export function solveASin(asinNode: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isTokenNumber(aToken)) {
		return -1;
	}

	const result = Math.asin(aToken[4].value);

	return dimensionToCalculation(asinNode, 'rad', result);
}
