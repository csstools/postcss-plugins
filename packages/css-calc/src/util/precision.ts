import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode } from '@csstools/css-parser-algorithms';
import { isTokenDimension, isTokenNumber, isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';

export function patchPrecision(x: TokenNode | FunctionNode | -1, precision = 13): TokenNode | FunctionNode | -1 {
	if (x === -1) {
		return -1;
	}

	if (precision <= 0) {
		return x;
	}

	if (isFunctionNode(x)) {
		return x;
	}

	const token = x.value;
	if (!isTokenNumeric(token)) {
		return x;
	}

	if (Number.isInteger(token[4].value)) {
		return x;
	}

	const result = Number(token[4].value.toFixed(precision)).toString();
	if (isTokenNumber(token)) {
		token[1] = result;
	} else if (isTokenPercentage(token)) {
		token[1] = result + '%';
	} else if (isTokenDimension(token)) {
		token[1] = result + token[4].unit;
	}

	return x;
}
