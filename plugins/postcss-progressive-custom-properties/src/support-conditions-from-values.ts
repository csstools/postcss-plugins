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

			// custom matchers :
			if (node.type === 'function' && (node.value === 'conic-gradient' || node.value === 'linear-gradient')) {
				let components = 0;
				let seenPrefix = false;

				for (let i = 0; i < node.nodes.length; i++) {
					const childNode = node.nodes[i];
					if (childNode.type === 'div' && childNode.value.trim() === ',') {
						components = 0;
						seenPrefix = true;
						continue;
					}

					if (childNode.type === 'word' || childNode.type === 'function') {
						components++;
					}

					if (seenPrefix && components === 3) {
						if (node.value === 'conic-gradient') {
							supportConditions.push('(background: conic-gradient(red 0%, red 0deg 1%, red 2deg))');
							return;
						}

						supportConditions.push('(background: linear-gradient(0deg, red 0% 1%, red 2%))');
						return;
					}
				}
			}
		});

	} catch (_) {
		/* ignore */
	}

	return supportConditions;
}
