import { NumberType, TokenDimension, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';
import { convertUnit } from '../unit-conversions';

export function solveMod(modNodes: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (
		!(
			aToken[0] === TokenType.Dimension ||
			aToken[0] === TokenType.Number ||
			aToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	const bToken = convertUnit(aToken, b.value);
	if (aToken[0] !== bToken[0]) {
		return -1;
	}

	if (aToken[0] === TokenType.Dimension) {
		if (aToken[4].unit !== (bToken as TokenDimension)[4].unit) {
			return -1;
		}
	}

	const result = ((aToken[4].value % bToken[4].value) + bToken[4].value) % bToken[4].value;

	const modTokens = modNodes.tokens();
	if (aToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + aToken[4].unit,
						modTokens[0][2],
						modTokens[modTokens.length - 1][3],
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
						modTokens[0][2],
						modTokens[modTokens.length - 1][3],
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
					modTokens[0][2],
					modTokens[modTokens.length - 1][3],
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
