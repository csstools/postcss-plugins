import type { Calculation } from '../calculation';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { isTokenNode } from '@csstools/css-parser-algorithms';
import { resultToCalculation } from './result-to-calculation';
import { arrayOfSameNumeric } from '../util/kind-of-number';
import { isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';
import type { conversionOptions } from '../options';

export function solveMax(maxNode: FunctionNode, solvedNodes: Array<ComponentValue>, options: conversionOptions): Calculation | -1 {
	if (!solvedNodes.every(isTokenNode)) {
		return -1;
	}

	const firstSolvedNode = solvedNodes[0];

	const firstSolvedToken = firstSolvedNode.value;
	if (!isTokenNumeric(firstSolvedToken)) {
		return -1;
	}

	if (!options.rawPercentages && isTokenPercentage(firstSolvedToken)) {
		return -1;
	}

	const tokens = solvedNodes.map((x) => convertUnit(firstSolvedToken, x.value));
	if (!arrayOfSameNumeric(tokens)) {
		return -1;
	}

	const values = tokens.map((x) => x[4].value);
	const result = Math.max(...values);

	return resultToCalculation(maxNode, firstSolvedToken, result);
}
