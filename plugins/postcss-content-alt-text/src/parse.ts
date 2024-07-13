import type { ComponentValue } from "@csstools/css-parser-algorithms";
import { isTokenNode, parseListOfComponentValues } from "@csstools/css-parser-algorithms";
import { isTokenDelim, tokenize } from "@csstools/css-tokenizer";

export function parse(str: string): Array<Array<ComponentValue>> {
	const componentValues = parseListOfComponentValues(
		tokenize({ css: str })
	);

	const parts: Array<Array<ComponentValue>> = []
	let lastSliceIndex = 0;

	for (let i = (componentValues.length - 1); i >= 0; i--) {
		const componentValue = componentValues[i];
		if (!isTokenNode(componentValue)) {
			continue;
		}

		const token = componentValue.value;
		if (!isTokenDelim(token)) {
			continue;
		}

		if (token[4].value !== '/') {
			continue;
		}

		parts.push(componentValues.slice(lastSliceIndex, i));
		lastSliceIndex = i + 1;
	}

	if (lastSliceIndex !== 0) {
		parts.push(componentValues.slice(lastSliceIndex, componentValues.length));
	}

	return parts;
}
