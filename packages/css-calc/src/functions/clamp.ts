import { TokenDimension, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, isTokenNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';

export function solveClamp(clampNode: FunctionNode, minimum: TokenNode | -1, central: TokenNode | -1, maximum: TokenNode | -1): Calculation | -1 {
	if (
		!isTokenNode(minimum) ||
		!isTokenNode(central) ||
		!isTokenNode(maximum)
	) {
		return -1;
	}

	const minimumToken = minimum.value;
	const centralToken = convertUnit(minimumToken, central.value);
	const maximumToken = convertUnit(minimumToken, maximum.value);

	if (
		!(
			minimumToken[0] === TokenType.Dimension ||
			minimumToken[0] === TokenType.Number ||
			minimumToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	if (minimumToken[0] !== centralToken[0]) {
		return -1;
	}

	if (minimumToken[0] !== maximumToken[0]) {
		return -1;
	}

	if (minimumToken[0] === TokenType.Dimension) {
		if (minimumToken[4].unit.toLowerCase() !== (centralToken as TokenDimension)[4].unit.toLowerCase()) {
			return -1;
		}

		if (minimumToken[4].unit.toLowerCase() !== (maximumToken as TokenDimension)[4].unit.toLowerCase()) {
			return -1;
		}
	}

	const result = Math.max(minimumToken[4].value, Math.min(centralToken[4].value, maximumToken[4].value));

	return resultToCalculation(clampNode, minimumToken, result);
}
