import { NumberType, TokenDimension, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { convertUnit } from '../unit-conversions';
import { unary } from '../operation/unary';

export function solveATan2(atan2Nodes: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (
		!(
			aToken[0] === TokenType.Dimension ||
			aToken[0] === TokenType.Number
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

	const result = Math.atan2(aToken[4].value, bToken[4].value);

	const atan2Tokens = atan2Nodes.tokens();

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Dimension,
					result.toString() + 'rad',
					atan2Tokens[0][2],
					atan2Tokens[atan2Tokens.length - 1][3],
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
