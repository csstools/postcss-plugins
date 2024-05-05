import { CSSToken, NumberType, TokenType, isTokenDimension, isTokenNumber, isTokenPercentage } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';

export function resultToCalculation(node: FunctionNode, aToken: CSSToken, result: number): Calculation | -1 {
	if (isTokenDimension(aToken)) {
		return dimensionToCalculation(node, aToken[4].unit, result);
	}

	if (isTokenPercentage(aToken)) {
		return percentageToCalculation(node, result);
	}

	if (isTokenNumber(aToken)) {
		return numberToCalculation(node, result);
	}

	return -1;
}

export function dimensionToCalculation(node: FunctionNode, unit: string, result: number): Calculation | -1 {
	const tokens = node.tokens();

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Dimension,
					result.toString() + unit,
					tokens[0][2],
					tokens[tokens.length - 1][3],
					{
						value: result,
						type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
						unit: unit,
					},
				],
			),
		],
		operation: unary,
	};
}

function percentageToCalculation(node: FunctionNode, result: number): Calculation | -1 {
	const tokens = node.tokens();

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

export function numberToCalculation(node: FunctionNode, result: number): Calculation | -1 {
	const tokens = node.tokens();

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
