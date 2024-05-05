import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isTokenNumber } from '@csstools/css-tokenizer';
import { numberToCalculation } from './result-to-calculation';

export function solveExp(expNode: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isTokenNumber(aToken)) {
		return -1;
	}

	const result = Math.exp(aToken[4].value);

	return numberToCalculation(expNode, result);
}
