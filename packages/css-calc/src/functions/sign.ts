import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { numberToCalculation } from './result-to-calculation';
import { isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';
import type { conversionOptions } from '../options';

export function solveSign(signNode: FunctionNode, a: TokenNode, options: conversionOptions): Calculation | -1 {
	const aToken = a.value;
	if (!isTokenNumeric(aToken)) {
		return -1;
	}

	if (!options.rawPercentages && isTokenPercentage(aToken)) {
		return -1;
	}

	const result = Math.sign(aToken[4].value);

	return numberToCalculation(signNode, result);
}
