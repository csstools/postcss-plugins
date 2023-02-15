import { CSSToken, NumberType, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';

export function resultToCalculation(node: FunctionNode, aToken: CSSToken, result: number): Calculation | -1 {
	const tokens = node.tokens();
	if (aToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + aToken[4].unit,
						tokens[0][2],
						tokens[tokens.length - 1][3],
						{
							value: result,
							type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
							unit: aToken[4].unit,
						},
					],
				),
			],
			operation: unary,
		};
	}

	if (aToken[0] === TokenType.Percentage) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Percentage,
						result.toString() + '%',
						tokens[0][2],
						tokens[tokens.length - 1][3],
						{
							value: result,
						},
					],
				),
			],
			operation: unary,
		};
	}

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Number,
					result.toString(),
					tokens[0][2],
					tokens[tokens.length - 1][3],
					{
						value: result,
						type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
					},
				],
			),
		],
		operation: unary,
	};
}
