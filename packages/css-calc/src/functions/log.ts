import type { Calculation } from '../calculation';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { isTokenNumber } from '@csstools/css-tokenizer';
import { isTokenNode } from '@csstools/css-parser-algorithms';
import { numberToCalculation } from './result-to-calculation';

export function solveLog(logNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1 {
	if (solvedNodes.length === 1) {
		const aNode = solvedNodes[0];
		if (!aNode || !isTokenNode(aNode)) {
			return -1;
		}

		const aToken = aNode.value;
		if (!isTokenNumber(aToken)) {
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
		if (!isTokenNumber(aToken)) {
			return -1;
		}

		const bNode = solvedNodes[1];
		if (!bNode || !isTokenNode(bNode)) {
			return -1;
		}

		const bToken = bNode.value;
		if (!isTokenNumber(bToken)) {
			return -1;
		}

		// NaN is infectious, forcing the function to return NaN if any argument calculation is NaN.
		if (Number.isNaN(aToken[4].value) || Number.isNaN(bToken[4].value)) {
			return numberToCalculation(logNode, Number.NaN);
		}

		// https://drafts.csswg.org/css-values-4/#exponent-infinities
		// If B is 1 or negative, the result is NaN.
		// B values between 0 and 1 (exclusive), or greater than 1, are valid.
		if (bToken[4].value === 1 || bToken[4].value <= 0) {
			return numberToCalculation(logNode, Number.NaN);
		}

		// If A is 1, the result is 0⁺.
		if (aToken[4].value === 1) {
			return numberToCalculation(logNode, +0);
		}

		const result = Math.log(aToken[4].value) / Math.log(bToken[4].value);

		return numberToCalculation(logNode, result);
	}

	return -1;
}
