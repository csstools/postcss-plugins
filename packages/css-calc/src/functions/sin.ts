import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isTokenDimension } from '@csstools/css-tokenizer';
import { convert_deg } from '../unit-conversions/deg';
import { convert_grad } from '../unit-conversions/grad';
import { convert_turn } from '../unit-conversions/turn';
import { numberToCalculation } from './result-to-calculation';
import { isDimensionOrNumber } from '../util/kind-of-number';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function solveSin(sinNode: FunctionNode, a: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isDimensionOrNumber(aToken)) {
		return -1;
	}

	let result = aToken[4].value;
	if (isTokenDimension(aToken)) {
		switch (toLowerCaseAZ(aToken[4].unit)) {
			case 'rad':
				break;
			case 'deg':
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				result = convert_deg.get('rad')!(aToken[4].value);
				break;
			case 'grad':
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				result = convert_grad.get('rad')!(aToken[4].value);
				break;
			case 'turn':
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				result = convert_turn.get('rad')!(aToken[4].value);
				break;
			default:
				return -1;
		}
	}

	result = Math.sin(result);

	return numberToCalculation(sinNode, result);
}
