import { TokenDimension, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';

export function solveMod(modNodes: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (
		!(
			aToken[0] === TokenType.Dimension ||
			aToken[0] === TokenType.Number ||
			aToken[0] === TokenType.Percentage
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

	return resultToCalculation(modNodes, aToken, result);
}
