import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { numberToCalculation } from './result-to-calculation';
import { isDimensionOrNumber } from '../util/kind-of-number';

export function solveSign(signNode: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isDimensionOrNumber(aToken)) {
		return -1;
	}

	const result = Math.sign(aToken[4].value);

	return numberToCalculation(signNode, result);
}
