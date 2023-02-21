import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';
import { isNumeric, twoOfSameNumeric } from '../util/kind-of-number';

export function solveRem(remNode: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isNumeric(aToken)) {
		return -1;
	}

	const bToken = convertUnit(aToken, b.value);
	if (!twoOfSameNumeric(aToken, bToken)) {
		return -1;
	}

	let result;
	if (bToken[4].value === 0) {
		result = Number.NaN;
	} else if (!Number.isFinite(aToken[4].value)) {
		result = Number.NaN;
	} else if (!Number.isFinite(bToken[4].value)) {
		result = aToken[4].value;
	} else {
		result = aToken[4].value % bToken[4].value;
	}

	return resultToCalculation(remNode, aToken, result);
}
