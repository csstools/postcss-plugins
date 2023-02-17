import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { numberToCalculation } from './result-to-calculation';

export function solvePow(powNode: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	const bToken = b.value;
	if (aToken[0] !== TokenType.Number || bToken[0] !== TokenType.Number) {
		return -1;
	}

	const result = Math.pow(aToken[4].value, bToken[4].value);

	return numberToCalculation(powNode, result);
}
