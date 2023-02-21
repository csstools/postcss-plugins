import type { Calculation } from '../calculation';
import type { ComponentValue, FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import type { TokenNumber } from '@csstools/css-tokenizer';
import { TokenType } from '@csstools/css-tokenizer';
import { isTokenNode } from '@csstools/css-parser-algorithms';
import { numberToCalculation } from './result-to-calculation';

export function solveLog(logNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1 {
	if (!(solvedNodes.length === 1 || solvedNodes.length === 2)) {
		return -1;
	}

	const firstSolvedNode = solvedNodes[0];
	if (!firstSolvedNode || !isTokenNode(firstSolvedNode)) {
		return -1;
	}

	const componentTypes = new Set(solvedNodes.map((x) => x.type));
	if (componentTypes.size !== 1) {
		return -1;
	}

	const firstSolvedToken = solvedNodes[0].value;
	if (firstSolvedToken[0] !== TokenType.Number) {
		return -1;
	}

	const tokenTypes = new Set(solvedNodes.map((x) => (x as TokenNode).value[0]));
	if (tokenTypes.size !== 1) {
		return -1;
	}

	const values = solvedNodes.map((x) => ((x as TokenNode).value as TokenNumber)[4].value);

	if (values.length === 1) {
		const result = Math.log(values[0]);

		return numberToCalculation(logNode, result);
	}

	const result = Math.log(values[0]) / Math.log(values[1]);

	return numberToCalculation(logNode, result);
}
