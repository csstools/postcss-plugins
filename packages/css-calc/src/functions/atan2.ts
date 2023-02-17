import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import type { TokenDimension } from '@csstools/css-tokenizer';
import { TokenType } from '@csstools/css-tokenizer';
import { convertUnit } from '../unit-conversions';
import { dimensionToCalculation } from './result-to-calculation';

export function solveATan2(atan2Node: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (
		!(
			aToken[0] === TokenType.Dimension ||
			aToken[0] === TokenType.Number
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

	const result = Math.atan2(aToken[4].value, bToken[4].value);

	return dimensionToCalculation(atan2Node, 'rad', result);
}
