import { NumberType, TokenDimension, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, isTokenNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';
import { convertUnit } from '../unit-conversions';

export function solveClamp(clampNode: FunctionNode, minimum: TokenNode | -1, central: TokenNode | -1, maximum: TokenNode | -1): Calculation | -1 {
	if (
		!isTokenNode(minimum) ||
		!isTokenNode(central) ||
		!isTokenNode(maximum)
	) {
		return -1;
	}

	const minimumToken = minimum.value;
	const centralToken = convertUnit(minimumToken, central.value);
	const maximumToken = convertUnit(minimumToken, maximum.value);

	if (
		!(
			minimumToken[0] === TokenType.Dimension ||
			minimumToken[0] === TokenType.Number ||
			minimumToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	if (minimumToken[0] !== centralToken[0]) {
		return -1;
	}

	if (minimumToken[0] !== maximumToken[0]) {
		return -1;
	}

	if (minimumToken[0] === TokenType.Dimension) {
		if (minimumToken[4].unit.toLowerCase() !== (centralToken as TokenDimension)[4].unit.toLowerCase()) {
			return -1;
		}

		if (minimumToken[4].unit.toLowerCase() !== (maximumToken as TokenDimension)[4].unit.toLowerCase()) {
			return -1;
		}
	}

	const result = Math.max(minimumToken[4].value, Math.min(centralToken[4].value, maximumToken[4].value));
	const clampTokens = clampNode.tokens();

	if (minimumToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + minimumToken[4].unit,
						clampTokens[0][2],
						clampTokens[clampTokens.length - 1][3],
						{
							value: result,
							type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
							unit: minimumToken[4].unit,
						},
					],
				),
			],
			operation: unary,
		};
	}

	if (minimumToken[0] === TokenType.Percentage) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Percentage,
						result.toString() + '%',
						clampTokens[0][2],
						clampTokens[clampTokens.length - 1][3],
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
					clampTokens[0][2],
					clampTokens[clampTokens.length - 1][3],
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
