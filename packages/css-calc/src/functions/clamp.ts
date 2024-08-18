import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { isTokenNode } from '@csstools/css-parser-algorithms';
import { resultToCalculation } from './result-to-calculation';
import { twoOfSameNumeric } from '../util/kind-of-number';
import type { conversionOptions } from '../options';
import { isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';

export function solveClamp(clampNode: FunctionNode, minimum: TokenNode | -1, central: TokenNode | -1, maximum: TokenNode | -1, options: conversionOptions): Calculation | -1 {
	if (
		!isTokenNode(minimum) ||
		!isTokenNode(central) ||
		!isTokenNode(maximum)
	) {
		return -1;
	}

	const minimumToken = minimum.value;
	if (!isTokenNumeric(minimumToken)) {
		return -1;
	}

	if (!options.rawPercentages && isTokenPercentage(minimumToken)) {
		return -1;
	}

	const centralToken = convertUnit(minimumToken, central.value);
	if (!twoOfSameNumeric(minimumToken, centralToken)) {
		return -1;
	}

	const maximumToken = convertUnit(minimumToken, maximum.value);
	if (!twoOfSameNumeric(minimumToken, maximumToken)) {
		return -1;
	}

	const result = Math.max(minimumToken[4].value, Math.min(centralToken[4].value, maximumToken[4].value));

	return resultToCalculation(clampNode, minimumToken, result);
}
