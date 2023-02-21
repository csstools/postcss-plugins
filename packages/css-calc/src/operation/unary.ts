import type { TokenNode } from '@csstools/css-parser-algorithms';
import { isNumeric } from '../util/kind-of-number';

export function unary(inputs: Array<TokenNode>): TokenNode | -1 {
	if (inputs.length !== 1) {
		return -1;
	}

	const aToken = inputs[0].value;
	if (isNumeric(aToken)) {
		return inputs[0];
	}

	return -1;
}
