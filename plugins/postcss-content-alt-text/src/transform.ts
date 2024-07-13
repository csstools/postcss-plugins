import type { ComponentValue } from "@csstools/css-parser-algorithms";
import { isTokenNode, isWhiteSpaceOrCommentNode, stringify } from "@csstools/css-parser-algorithms";
import { isTokenString } from "@csstools/css-tokenizer";

export function transform(parts: Array<Array<ComponentValue>>, stripAltText?: boolean): string {
	const firstPart = parts[0];
	if (!firstPart.length) {
		return '';
	}

	if (stripAltText) {
		return stringify([firstPart]);
	}

	const relevantComponentValues = parts[1].filter((x) => !isWhiteSpaceOrCommentNode(x));
	if (
		relevantComponentValues.length === 1 &&
		isTokenNode(relevantComponentValues[0]) &&
		isTokenString(relevantComponentValues[0].value) &&
		relevantComponentValues[0].value[4].value === ''
	) {
		return stringify([firstPart]);
	}

	return stringify([[
		...firstPart,
		...parts[1],
	]]);
}
