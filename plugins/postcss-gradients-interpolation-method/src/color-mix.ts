import { color } from '@csstools/css-color-parser';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { serializeRGB } from '@csstools/css-color-parser';
import { tokenize } from '@csstools/css-tokenizer';

const colorMixNameRegex = /^color-mix$/i;

export function colorMix(x: string) {
	const replaced = replaceComponentValues(
		parseCommaSeparatedListOfComponentValues(tokenize({ css: x })),
		(componentValue) => {
			if (isFunctionNode(componentValue) && colorMixNameRegex.test(componentValue.getName())) {
				const colorData = color(componentValue);
				if (!colorData) {
					return;
				}

				return serializeRGB(colorData);
			}
		},
	);

	return stringify(replaced);
}
