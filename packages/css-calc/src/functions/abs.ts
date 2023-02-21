import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { resultToCalculation } from './result-to-calculation';
import { isDimensionOrNumber } from '../util/kind-of-number';

export function solveAbs(absNode: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isDimensionOrNumber(aToken)) {
		return -1;
	}

	const result = Math.abs(aToken[4].value);

	return resultToCalculation(absNode, aToken, result);
}
