import { TokenDimension, TokenNumber, TokenPercentage, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, FunctionNode, isTokenNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';

export function solveMax(maxNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1 {
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

	const result = Math.max(...values);

	return resultToCalculation(maxNode, firstSolvedToken, result);
}
