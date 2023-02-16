import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';
import { convert_deg } from '../unit-conversions/deg';
import { convert_grad } from '../unit-conversions/grad';
import { convert_turn } from '../unit-conversions/turn';
import { convert_rad } from '../unit-conversions/rad';

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

	const startingValue = aToken[4].value;

	let degrees = 0;
	if (aToken[0] === TokenType.Dimension) {
		switch (aToken[4].unit.toLowerCase()) {
			case 'rad':
				degrees = convert_rad.get('deg')(startingValue);
				break;
			case 'deg':
				degrees = startingValue;
				aToken[4].value = convert_deg.get('rad')(startingValue);
				break;
			case 'grad':
				degrees = convert_grad.get('deg')(startingValue);
				aToken[4].value = convert_grad.get('rad')(startingValue);
				break;
			case 'turn':
				degrees = convert_turn.get('deg')(startingValue);
				aToken[4].value = convert_turn.get('rad')(startingValue);
				break;
			default:
				return -1;
		}
	}

	const isNinetyMultiple = degrees % 90 === 0;
	const timesNinety = degrees / 90;
	const isAsymptote = isNinetyMultiple && timesNinety % 2 !== 0;

	let result;
	if (isAsymptote) {
		result = timesNinety > 0 ? Infinity : -Infinity;
	} else {
		result = Math.tan(aToken[4].value);
	}

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
