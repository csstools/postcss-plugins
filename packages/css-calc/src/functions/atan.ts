import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';

export function solveATan(atanNodes: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (aToken[0] !== TokenType.Number) {
		return -1;
	}

	const result = Math.atan(aToken[4].value);

	const atanTokens = atanNodes.tokens();

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Dimension,
					result.toString() + 'rad',
					atanTokens[0][2],
					atanTokens[atanTokens.length - 1][3],
					{
						value: result,
						type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
						unit: 'rad',
					},
				],
			),
		],
		operation: unary,
	};
}
