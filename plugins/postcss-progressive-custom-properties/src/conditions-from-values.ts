import valueParser from 'postcss-value-parser';
import { doublePositionGradients } from './custom/double-position-gradients';
import { matchers } from './matchers';
import { matches } from './match';

const varFunctionName = /^var$/i;

export function conditionsFromValue(value: string, mustContainVar = false): { support: Array<string> } {
	const supportConditions: Array<string> = [];

	const relevantMatchers = matchers.filter((matcher) => {
		return value.includes(matcher.sniff);
	});

	let hasVar = false;

	try {
		const ast = valueParser(value);
		ast.walk((node) => {
			if (node.type === 'function' && varFunctionName.test(node.value)) {
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

	} catch (_) {
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
