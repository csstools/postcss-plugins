import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { numberToCalculation } from './result-to-calculation';

export function solveSqrt(sqrtNode: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (aToken[0] !== TokenType.Number) {
		return -1;
	}

	const result = Math.sqrt(aToken[4].value);

	return numberToCalculation(sqrtNode, result);
}
