import valueParser from 'postcss-value-parser';
import { matchers } from './matchers';
import { matches } from './match';
import { doublePositionGradients } from './custom/double-position-gradients';

export function supportConditionsFromValue(value: string): Array<string> {
	const supportConditions: Array<string> = [];

	const relevantMatchers = [];

	matchers.forEach((matcher) => {
		if (value.indexOf(matcher.sniff) > -1) {
			relevantMatchers.push(matcher);
		}
	});

	try {
		const ast = valueParser(value);
		ast.walk((node) => {
			try {
				node['dimension'] = valueParser.unit(node.value);
			} finally {
				if (node['dimension'] === false) {
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

	return Array.from(new Set(supportConditions)); // list with unique items.
}
