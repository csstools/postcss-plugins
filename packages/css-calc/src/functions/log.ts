import type { Calculation } from '../calculation';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { isTokenNode } from '@csstools/css-parser-algorithms';
import { numberToCalculation } from './result-to-calculation';

export function solveLog(logNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1 {
	if (solvedNodes.length === 1) {
		const aNode = solvedNodes[0];
		if (!aNode || !isTokenNode(aNode)) {
			return -1;
		}

		const aToken = aNode.value;
		if (aToken[0] !== TokenType.Number) {
			return -1;
		}

		const result = Math.log(aToken[4].value);

		return numberToCalculation(logNode, result);
	}

	if (solvedNodes.length === 2) {
		const aNode = solvedNodes[0];
		if (!aNode || !isTokenNode(aNode)) {
			return -1;
		}

		const aToken = aNode.value;
		if (aToken[0] !== TokenType.Number) {
			return -1;
		}

		const bNode = solvedNodes[1];
		if (!bNode || !isTokenNode(bNode)) {
			return -1;
		}

		const bToken = bNode.value;
		if (bToken[0] !== TokenType.Number) {
			return -1;
		}

		const result = Math.log(aToken[4].value) / Math.log(bToken[4].value);

		return numberToCalculation(logNode, result);
	}

	return -1;
}
