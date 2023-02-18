import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { convert_deg } from '../unit-conversions/deg';
import { convert_grad } from '../unit-conversions/grad';
import { convert_rad } from '../unit-conversions/rad';
import { convert_turn } from '../unit-conversions/turn';
import { numberToCalculation } from './result-to-calculation';

export function solveTan(tanNode: FunctionNode, a: TokenNode): Calculation | -1 {
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
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				degrees = convert_rad.get('deg')!(startingValue);
				break;
			case 'deg':
				degrees = startingValue;
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				aToken[4].value = convert_deg.get('rad')!(startingValue);
				break;
			case 'grad':
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				degrees = convert_grad.get('deg')!(startingValue);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				aToken[4].value = convert_grad.get('rad')!(startingValue);
				break;
			case 'turn':
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				degrees = convert_turn.get('deg')!(startingValue);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				aToken[4].value = convert_turn.get('rad')!(startingValue);
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

	return numberToCalculation(tanNode, result);
}
