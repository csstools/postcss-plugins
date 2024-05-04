import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode } from '@csstools/css-parser-algorithms';
import { isTokenDimension, isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';

export function patchMinusZero(x: TokenNode | FunctionNode | -1): TokenNode | FunctionNode | -1 {
	if (x === -1) {
		return -1;
	}

	if (isFunctionNode(x)) {
		return x;
	}

	const token = x.value;
	if (!isTokenNumeric(token)) {
		return x;
	}

	if (!Object.is(-0, token[4].value)) {
		return x;
	}

	if (token[1] === '-0') {
		return x;
	}

	if (isTokenPercentage(token)) {
		token[1] = '-0%';
	} else if (isTokenDimension(token)) {
		token[1] = '-0' + token[4].unit;
	} else {
		token[1] = '-0';
	}

	return x;
}
