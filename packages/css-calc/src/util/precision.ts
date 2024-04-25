import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';

export function patchPrecision(x: TokenNode | FunctionNode | -1, precision = 13): TokenNode | FunctionNode | -1 {
	if (x === -1 || precision < 0) {
		return -1;
	}

	if (isFunctionNode(x)) {
		return x;
	}

	const token = x.value;
	if (
		token[0] !== TokenType.Number &&
		token[0] !== TokenType.Percentage &&
		token[0] !== TokenType.Dimension
	) {
		return x;
	}

	if (Number.isInteger(token[4].value)) {
		return x;
	}

	const result = Number(token[4].value.toFixed(precision)).toString();
	if (token[0] === TokenType.Number) {
		token[1] = result;
	} else if (token[0] === TokenType.Percentage) {
		token[1] = result + '%';
	} else if (token[0] === TokenType.Dimension) {
		token[1] = result + token[4].unit;
	}

	return x;
}
