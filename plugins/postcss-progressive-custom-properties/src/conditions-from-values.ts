import valueParser from 'postcss-value-parser';
import { doublePositionGradients } from './custom/double-position-gradients';
import { matchers } from './matchers';
import { matches } from './match';
import type { Declaration } from 'postcss';

const VAR_FUNCTION_NAME_REGEX = /^var$/i;

export function conditionsFromValue(decl: Declaration, mustContainVar = false): { support: Array<string> } {
	const value = decl.value;

	const supportConditions: Array<string> = [];

	const relevantMatchers = matchers.filter((matcher) => {
		return value.includes(matcher.sniff) && (matcher.only_on_property ?? decl.prop) === decl.prop;
	});

	let hasVar = false;

	try {
		const ast = valueParser(value);
		ast.walk((node) => {
			if (node.type === 'function' && VAR_FUNCTION_NAME_REGEX.test(node.value)) {
				hasVar = true;
			}

			try {
				const dimension = valueParser.unit(node.value);
				if (dimension !== false) {
					// @ts-expect-error We need to extend this type.
					node['dimension'] = dimension;
				}
			} catch { } // eslint-disable-line no-empty

			for (let i = 0; i < relevantMatchers.length; i++) {
				const propertyValueMatcher = relevantMatchers[i];

				for (let j = 0; j < propertyValueMatcher.matchers.length; j++) {
					const matcherAST = propertyValueMatcher.matchers[j];
					// Matchers are ordered from most specific to least.
					// Only one needs to match.
					if (matches(matcherAST, node)) {
						supportConditions.push(`(${propertyValueMatcher.property}: ${propertyValueMatcher.supports})`);
						return;
					}
				}
			}

			supportConditions.push(...doublePositionGradients(node));
		});

	} catch {
		/* ignore */
	}

	if (mustContainVar && !hasVar) {
		return {
			support: [],
		};
	}

	return {
		support: Array.from(new Set(supportConditions)).sort(),
	};
}
