import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { isTokenIdent } from '@csstools/css-tokenizer';

const IS_NONE_REGEX = /^none$/i;

export function isNone(v: Array<ComponentValue> | ComponentValue): boolean {
	if (Array.isArray(v)) {
		const relevantNodes = v.filter((x) => !(isWhitespaceNode(x) && isCommentNode(x)));
		if (relevantNodes.length === 1) {
			return isNone(relevantNodes[0]);
		}

		return false;
	}

	if (!isTokenNode(v)) {
		return false;
	}

	const token = v.value;
	if (!isTokenIdent(token)) {
		return false;
	}

	return IS_NONE_REGEX.test(token[4].value);
}
