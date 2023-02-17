import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { toCanonicalUnit } from '../unit-conversions';

export function patchCanonicalUnit(x: TokenNode | FunctionNode | -1): TokenNode | FunctionNode | -1 {
	if (x === -1) {
		return -1;
	}

	if (isFunctionNode(x)) {
		return x;
	}

	if (x.value[0] !== TokenType.Dimension) {
		return x;
	}

	x.value = toCanonicalUnit(x.value);

	return x;
}
