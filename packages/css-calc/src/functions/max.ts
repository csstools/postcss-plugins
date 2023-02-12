import { NumberType, TokenDimension, TokenNumber, TokenPercentage, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, FunctionNode, isTokenNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';

export function solveMax(maxNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1 {
	const firstSolvedNode = solvedNodes[0];
	if (!firstSolvedNode || !isTokenNode(firstSolvedNode)) {
		return -1;
	}

	const componentTypes = new Set(solvedNodes.map((x) => x.type));
	if (componentTypes.size !== 1) {
		return -1;
	}

	const firstSolvedToken = solvedNodes[0].value;
	if (
		!(
			firstSolvedToken[0] === TokenType.Dimension ||
			firstSolvedToken[0] === TokenType.Number ||
			firstSolvedToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	const tokenTypes = new Set(solvedNodes.map((x) => (x as TokenNode).value[0]));
	if (tokenTypes.size !== 1) {
		return -1;
	}

	const units = new Set(solvedNodes.map((x) => ((x as TokenNode).value[4]['unit'] ?? '').toLowerCase()));
	if (units.size !== 1) {
		return -1;
	}

	const values = solvedNodes.map((x) => ((x as TokenNode).value as TokenDimension | TokenNumber | TokenPercentage)[4].value);

	const result = Math.max(...values);
	const maxTokens = maxNode.tokens();

	if (firstSolvedToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + firstSolvedToken[4].unit,
						maxTokens[0][2],
						maxTokens[maxTokens.length - 1][3],
						{
							value: result,
							type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
							unit: firstSolvedToken[4].unit,
						},
					],
				),
			],
			operation: unary,
		};
	}

	if (firstSolvedToken[0] === TokenType.Percentage) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Percentage,
						result.toString() + '%',
						maxTokens[0][2],
						maxTokens[maxTokens.length - 1][3],
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
					maxTokens[0][2],
					maxTokens[maxTokens.length - 1][3],
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
