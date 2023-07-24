import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';

export function patchMinusZero(x: TokenNode | FunctionNode | -1): TokenNode | FunctionNode | -1 {
	if (x === -1) {
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

	if (!Object.is(-0, token[4].value)) {
		return x;
	}

	if (token[1] === '-0') {
		return x;
	}

	token[1] = `calc(-1 * ${token[1]})`;
	return x;
}
