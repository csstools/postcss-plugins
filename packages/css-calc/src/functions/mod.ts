import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';
import { twoOfSameNumeric } from '../util/kind-of-number';
import { isTokenNumeric } from '@csstools/css-tokenizer';

export function solveMod(modNode: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (!isTokenNumeric(aToken)) {
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
	} else if (!Number.isFinite(bToken[4].value) && (
		(
			bToken[4].value === Number.POSITIVE_INFINITY && (
				aToken[4].value === Number.NEGATIVE_INFINITY ||
				Object.is(aToken[4].value * 0, -0)
			)
		) || (
			bToken[4].value === Number.NEGATIVE_INFINITY && (
				aToken[4].value === Number.POSITIVE_INFINITY ||
				Object.is(aToken[4].value * 0, 0)
			)
		)
	)) {
		result = Number.NaN;
	} else if (!Number.isFinite(bToken[4].value)) {
		result = aToken[4].value;
	} else {
		result = ((aToken[4].value % bToken[4].value) + bToken[4].value) % bToken[4].value;
	}

	return resultToCalculation(modNode, aToken, result);
}
