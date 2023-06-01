import valueParser from 'postcss-value-parser';
import { matchers } from './matchers';
import { matches } from './match';
import { doublePositionGradients } from './custom/double-position-gradients';

const varFunctionName = /^var$/i;

export function supportConditionsFromValue(value: string, mustContainVar = false): Array<string> {
	const supportConditions: Array<string> = [];

	const relevantMatchers: typeof matchers = [];

	matchers.forEach((matcher) => {
		if (value.indexOf(matcher.sniff) > -1) {
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
		return [];
	}

	if (hasVar && supportConditions.length > 0) {
		// Only where there are other conditions and a `var()` is present.
		supportConditions.push('(top: var(--f))');
	}

	return Array.from(new Set(supportConditions)); // list with unique items.
}
