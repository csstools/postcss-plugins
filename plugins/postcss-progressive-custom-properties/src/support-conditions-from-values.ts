import valueParser from 'postcss-value-parser';
import { matchers } from './matchers';
import { matches } from './match';

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
			matcherLoop: for (let i = 0; i < relevantMatchers.length; i++) {
				const propertyValueMatcher = relevantMatchers[i];

				for (let j = 0; j < propertyValueMatcher.matchers.length; j++) {
					const matcherAST = propertyValueMatcher.matchers[j];
					// Matchers are ordered from most specific to least.
					// Only one needs to match.
					if (matches(matcherAST, node)) {
						supportConditions.push(`(${propertyValueMatcher.property}: ${propertyValueMatcher.supports})`);
						break matcherLoop;
					}
				}
			}
		});

	} catch (_) {
		/* ignore */
	}

	return supportConditions;
}
