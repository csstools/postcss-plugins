import { stringify, tokenizer } from '@csstools/css-tokenizer';
import { isFunctionNode, isSimpleBlockNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { solve } from './calculation';

import { calc, clamp, max, min } from './functions/calc';
import { GlobalsWithStrings, tokenizeGlobals } from './util/globals';

export function convert(css: string, globals?: GlobalsWithStrings) {
	const tokenizedGlobals = tokenizeGlobals(globals);

	const t = tokenizer({
		css: css,
	});

	const tokens = [];

	{
		while (!t.endOfFile()) {
			tokens.push(t.nextToken());
		}

		tokens.push(t.nextToken()); // EOF-token
	}

	const options = {
		onParseError: ((err) => {
			throw err;
		}),
	};

	const result = parseCommaSeparatedListOfComponentValues(tokens, options);

	for (let i = 0; i < result.length; i++) {
		const componentValues = result[i];

		for (let j = 0; j < componentValues.length; j++) {
			const componentValue = componentValues[j];

			if (isFunctionNode(componentValue)) {
				if (componentValue.getName().toLowerCase() === 'calc') {
					const calcResult = solve(calc(componentValue, tokenizedGlobals));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'clamp') {
					const calcResult = solve(clamp(componentValue, tokenizedGlobals));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'min') {
					const calcResult = solve(min(componentValue, tokenizedGlobals));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'max') {
					const calcResult = solve(max(componentValue, tokenizedGlobals));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				}
			}

			if (!isSimpleBlockNode(componentValue) && !isFunctionNode(componentValue)) {
				continue;
			}

			componentValue.walk((entry, index) => {
				if (typeof index !== 'number') {
					return;
				}

				const node = entry.node;
				if (isFunctionNode(node)) {
					if (node.getName().toLowerCase() === 'calc') {
						const calcResult = solve(calc(node, tokenizedGlobals));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'clamp') {
						const calcResult = solve(clamp(node, tokenizedGlobals));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'min') {
						const calcResult = solve(min(node, tokenizedGlobals));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'max') {
						const calcResult = solve(max(node, tokenizedGlobals));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					}
				}
			});
		}
	}

	return result.map((componentValues) => {
		return componentValues.map((x) => stringify(...x.tokens())).join('');
	}).join(',');
}

