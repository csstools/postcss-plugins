import type { TokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';

export function unary(inputs: Array<TokenNode>): TokenNode | -1 {
	if (inputs.length !== 1) {
		return -1;
	}

	const aToken = inputs[0].value;

	if (aToken[0] === TokenType.Number) {
		return inputs[0];
	}

	if (aToken[0] === TokenType.Dimension) {
		return inputs[0];
	}

	if (aToken[0] === TokenType.Percentage) {
		return inputs[0];
	}

	return -1;
}
