import { TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { resultToCalculation } from './result-to-calculation';

export function solveAbs(absNodes: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (
		!(
			aToken[0] === TokenType.Dimension ||
			aToken[0] === TokenType.Number
		)
	) {
		return -1;
	}

	const result = Math.abs(aToken[4].value);

	return resultToCalculation(absNodes, aToken, result);
}
