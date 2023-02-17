import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { convert_deg } from '../unit-conversions/deg';
import { convert_grad } from '../unit-conversions/grad';
import { convert_turn } from '../unit-conversions/turn';
import { numberToCalculation } from './result-to-calculation';

export function solveCos(cosNode: FunctionNode, a: TokenNode): Calculation | -1 {
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

	const result = Math.cos(aToken[4].value);

	return numberToCalculation(cosNode, result);
}
