import type { Calculation } from '../calculation';
import type { ComponentValue, FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import type { TokenDimension, TokenNumber, TokenPercentage } from '@csstools/css-tokenizer';
import { TokenType } from '@csstools/css-tokenizer';
import { convertUnit } from '../unit-conversions';
import { isTokenNode } from '@csstools/css-parser-algorithms';
import { resultToCalculation } from './result-to-calculation';

export function solveMin(minNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1 {
	const firstSolvedNode = solvedNodes[0];
	if (!firstSolvedNode || !isTokenNode(firstSolvedNode)) {
		return -1;
	}

	const componentTypes = new Set(solvedNodes.map((x) => x.type));
	if (componentTypes.size !== 1) {
		return -1;
	}

	const firstSolvedToken = solvedNodes[0].value;
	if (
		!(
			firstSolvedToken[0] === TokenType.Dimension ||
			firstSolvedToken[0] === TokenType.Number ||
			firstSolvedToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	const tokenTypes = new Set(solvedNodes.map((x) => (x as TokenNode).value[0]));
	if (tokenTypes.size !== 1) {
		return -1;
	}

	const tokens = solvedNodes.map((x) => convertUnit(firstSolvedToken, (x as TokenNode).value));

	const units = new Set(tokens.map((x) => (x[4]['unit'] ?? '').toLowerCase()));
	if (units.size !== 1) {
		return -1;
	}

	const values = tokens.map((x) => (x as TokenDimension | TokenNumber | TokenPercentage)[4].value);

	const result = Math.min(...values);

	return resultToCalculation(minNode, firstSolvedToken, result);
}
