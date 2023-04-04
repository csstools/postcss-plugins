import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { convert_deg } from '../unit-conversions/deg';
import { convert_grad } from '../unit-conversions/grad';
import { convert_rad } from '../unit-conversions/rad';
import { convert_turn } from '../unit-conversions/turn';
import { numberToCalculation } from './result-to-calculation';
import { isDimensionOrNumber } from '../util/kind-of-number';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function solveTan(tanNode: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isDimensionOrNumber(aToken)) {
		return -1;
	}

	const startingValue = aToken[4].value;

	let degrees = 0;
	let result = aToken[4].value;
	if (aToken[0] === TokenType.Dimension) {
		switch (toLowerCaseAZ(aToken[4].unit)) {
			case 'rad':
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				degrees = convert_rad.get('deg')!(startingValue);
				break;
			case 'deg':
				degrees = startingValue;
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				result = convert_deg.get('rad')!(startingValue);
				break;
			case 'grad':
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				degrees = convert_grad.get('deg')!(startingValue);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				result = convert_grad.get('rad')!(startingValue);
				break;
			case 'turn':
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				degrees = convert_turn.get('deg')!(startingValue);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				result = convert_turn.get('rad')!(startingValue);
				break;
			default:
				return -1;
		}
	}

	const isNinetyMultiple = degrees % 90 === 0;
	const timesNinety = degrees / 90;
	const isAsymptote = isNinetyMultiple && timesNinety % 2 !== 0;

	if (isAsymptote) {
		result = timesNinety > 0 ? Infinity : -Infinity;
	} else {
		result = Math.tan(result);
	}

	return numberToCalculation(tanNode, result);
}
