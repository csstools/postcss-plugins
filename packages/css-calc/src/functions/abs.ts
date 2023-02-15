import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';

export function solveAbs(absNodes: FunctionNode, a): Calculation | -1 {
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

	const absTokens = absNodes.tokens();
	if (aToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + aToken[4].unit,
						absTokens[0][2],
						absTokens[absTokens.length - 1][3],
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
						absTokens[0][2],
						absTokens[absTokens.length - 1][3],
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
					absTokens[0][2],
					absTokens[absTokens.length - 1][3],
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
