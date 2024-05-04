import type { TokenNode } from '@csstools/css-parser-algorithms';
import { isTokenNumeric } from '@csstools/css-tokenizer';

export function unary(inputs: Array<TokenNode>): TokenNode | -1 {
	if (inputs.length !== 1) {
		return -1;
	}

	const aToken = inputs[0].value;
	if (isTokenNumeric(aToken)) {
		return inputs[0];
	}

	return -1;
}
