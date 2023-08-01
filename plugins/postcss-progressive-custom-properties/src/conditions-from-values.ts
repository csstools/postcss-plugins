import valueParser from 'postcss-value-parser';
import { color, colorDataFitsRGB_Gamut, colorDataFitsDisplayP3_Gamut } from '@csstools/css-color-parser';
import { doublePositionGradients } from './custom/double-position-gradients';
import { matchers } from './matchers';
import { matches } from './match';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

const varFunctionName = /^var$/i;

export function conditionsFromValue(value: string, mustContainVar = false): { support: Array<string>, media: Array<string> } {
	const supportConditions: Array<string> = [];
	const mediaConditions: Array<string> = [];

	const relevantMatchers: typeof matchers = [];

	matchers.forEach((matcher) => {
		if (value.includes(matcher.sniff)) {
			relevantMatchers.push(matcher);
		}
	});

	let hasVar = false;

	try {
		const ast = valueParser(value);
		ast.walk((node) => {
			if (node.type === 'function' && varFunctionName.test(node.value)) {
				hasVar = true;
			}

			try {
				// @ts-expect-error We need to extend this type.
				node['dimension'] = valueParser.unit(node.value);
			} finally {
				// @ts-expect-error We need to extend this type.
				if (node['dimension'] === false) {
					// @ts-expect-error We need to extend this type.
					delete node['dimension'];
				}
			}

			for (let i = 0; i < relevantMatchers.length; i++) {
				const propertyValueMatcher = relevantMatchers[i];

				for (let j = 0; j < propertyValueMatcher.matchers.length; j++) {
					const matcherAST = propertyValueMatcher.matchers[j];
					// Matchers are ordered from most specific to least.
					// Only one needs to match.
					if (matches(matcherAST, node)) {
						if (propertyValueMatcher.property === 'color') {
							const condition = colorGamutConditions(node);
							if (condition) {
								mediaConditions.push(condition);
							}
						}

						supportConditions.push(`(${propertyValueMatcher.property}: ${propertyValueMatcher.supports})`);
						return;
					}
				}
			}

			supportConditions.push(...doublePositionGradients(node));
		});

	} catch (_) {
		/* ignore */
	}

	if (mustContainVar && !hasVar) {
		return {
			support: [],
			media: [],
		};
	}

	if (hasVar && supportConditions.length > 0) {
		// Only where there are other conditions and a `var()` is present.
		supportConditions.push('(top: var(--f))');
	}

	return {
		support: Array.from(new Set(supportConditions)).sort(),
		media: Array.from(new Set(mediaConditions)).sort(),
	};
}

function colorGamutConditions(node: valueParser.Node) {
	const componentValue = parseComponentValue(
		tokenize({ css: valueParser.stringify(node) }),
	);

	if (!componentValue) {
		return false;
	}

	const colorData = color(
		componentValue,
	);

	if (!colorData) {
		return false;
	}

	if (colorDataFitsRGB_Gamut(colorData)) {
		return false;
	}

	if (colorDataFitsDisplayP3_Gamut(colorData)) {
		return '(color-gamut: display-p3)';
	}

	return '(color-gamut: rec2020)';
}
