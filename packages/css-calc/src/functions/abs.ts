import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { resultToCalculation } from './result-to-calculation';
import type { conversionOptions } from '../options';
import { isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';

export function solveAbs(absNode: FunctionNode, a: TokenNode, options: conversionOptions): Calculation | -1 {
	const aToken = a.value;
	if (!isTokenNumeric(aToken)) {
		return -1;
	}

	if (!options.rawPercentages && isTokenPercentage(aToken)) {
		return -1;
	}

	const result = Math.abs(aToken[4].value);

	return resultToCalculation(absNode, aToken, result);
}
