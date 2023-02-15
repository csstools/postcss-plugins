import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';
import { convert_deg } from '../unit-conversions/deg';
import { convert_grad } from '../unit-conversions/grad';
import { convert_turn } from '../unit-conversions/turn';

export function solveTan(tanNodes: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (
		!(
			aToken[0] === TokenType.Dimension ||
			aToken[0] === TokenType.Number
		)
	) {
		return -1;
	}

	if (aToken[0] === TokenType.Dimension) {
		switch (aToken[4].unit.toLowerCase()) {
			case 'rad':
				break;
			case 'deg':
				aToken[4].value = convert_deg.get('rad')(aToken[4].value);
				break;
			case 'grad':
				aToken[4].value = convert_grad.get('rad')(aToken[4].value);
				break;
			case 'turn':
				aToken[4].value = convert_turn.get('rad')(aToken[4].value);
				break;
			default:
				return -1;
		}
	}

	const result = Math.tan(aToken[4].value);

	const tanTokens = tanNodes.tokens();

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Number,
					result.toString(),
					tanTokens[0][2],
					tanTokens[tanTokens.length - 1][3],
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
