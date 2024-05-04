import type { Calculation } from '../calculation';
import type { ComponentValue, FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { isTokenNode } from '@csstools/css-parser-algorithms';
import { resultToCalculation } from './result-to-calculation';
import { arrayOfSameNumeric } from '../util/kind-of-number';
import { isTokenNumeric } from '@csstools/css-tokenizer';

export function solveHypot(hypotNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1 {
	const firstSolvedNode = solvedNodes[0];
	if (!firstSolvedNode || !isTokenNode(firstSolvedNode)) {
		return -1;
	}

	const componentTypes = new Set(solvedNodes.map((x) => x.type));
	if (componentTypes.size !== 1) {
		return -1;
	}

	const firstSolvedToken = firstSolvedNode.value;
	if (!isTokenNumeric(firstSolvedToken)) {
		return -1;
	}

	const tokens = solvedNodes.map((x) => convertUnit(firstSolvedToken, (x as TokenNode).value));
	if (!arrayOfSameNumeric(tokens)) {
		return -1;
	}

	const values = tokens.map((x) => x[4].value);
	const result = Math.hypot(...values);

	return resultToCalculation(hypotNode, firstSolvedToken, result);
}
