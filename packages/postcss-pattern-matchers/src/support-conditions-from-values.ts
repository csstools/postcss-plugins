import valueParser from 'postcss-value-parser';
import { valueMatchers as matchers } from './value-matchers';
import { matches } from './match';
import { doublePositionGradients } from './custom/double-position-gradients';

export function supportConditionsFromValue(value: string): Array<string> {
	const supportConditions: Set<string> = new Set();

	const relevantMatchers = [];

	matchers.forEach((matcher) => {
		if (value.indexOf(matcher.sniff) > -1) {
			relevantMatchers.push(matcher);
		}
	});

	if (
		!relevantMatchers.length &&
		value.indexOf('-gradient(') === -1
	) {
		return [];
	}

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
						supportConditions.add(propertyValueMatcher.supports);
						return;
					}
				}
			}

			doublePositionGradients(node).forEach((condition) => {
				supportConditions.add(condition);
			});
		});

	} catch (_) {
		/* ignore */
	}

	return Array.from(supportConditions); // list with unique items.
}
