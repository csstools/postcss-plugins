import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { dimensionToCalculation } from './result-to-calculation';
import { isDimensionOrNumber, twoOfSameNumeric } from '../util/kind-of-number';

export function solveATan2(atan2Node: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isDimensionOrNumber(aToken)) {
		return -1;
	}

	const bToken = convertUnit(aToken, b.value);
	if (!twoOfSameNumeric(aToken, bToken)) {
		return -1;
	}

	const result = Math.atan2(aToken[4].value, bToken[4].value);

	return dimensionToCalculation(atan2Node, 'rad', result);
}
