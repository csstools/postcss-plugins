import { stringify, tokenizer } from '@csstools/css-tokenizer';
import { isFunctionNode, isSimpleBlockNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { solve } from './calculation';
import { calc, clamp, max, min, mod, rem, round } from './functions/calc';
import { GlobalsWithStrings, tokenizeGlobals } from './util/globals';
import { patchNaN } from './util/nan';
import { patchInfinity } from './util/infinity';
import { patchMinusZero } from './util/minus-zero';

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

	const options = {};

	const result = parseCommaSeparatedListOfComponentValues(tokens, options);

	for (let i = 0; i < result.length; i++) {
		const componentValues = result[i];

		for (let j = 0; j < componentValues.length; j++) {
			const componentValue = componentValues[j];

			if (isFunctionNode(componentValue)) {
				if (componentValue.getName().toLowerCase() === 'calc') {
					const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(calc(componentValue, tokenizedGlobals)))));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'clamp') {
					const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(clamp(componentValue, tokenizedGlobals)))));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'min') {
					const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(min(componentValue, tokenizedGlobals)))));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'max') {
					const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(max(componentValue, tokenizedGlobals)))));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'round') {
					const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(round(componentValue, tokenizedGlobals)))));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'mod') {
					const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(mod(componentValue, tokenizedGlobals)))));
					if (calcResult !== -1) {
						componentValues.splice(j, 1, calcResult);
						continue;
					}
				} else if (componentValue.getName().toLowerCase() === 'rem') {
					const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(rem(componentValue, tokenizedGlobals)))));
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
						const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(calc(node, tokenizedGlobals)))));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'clamp') {
						const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(clamp(node, tokenizedGlobals)))));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'min') {
						const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(min(node, tokenizedGlobals)))));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'max') {
						const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(max(node, tokenizedGlobals)))));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'round') {
						const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(round(node, tokenizedGlobals)))));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'mod') {
						const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(mod(node, tokenizedGlobals)))));
						if (calcResult !== -1) {
							entry.parent.value.splice(index, 1, calcResult);
							return;
						}
					} else if (node.getName().toLowerCase() === 'rem') {
						const calcResult = patchMinusZero(patchInfinity(patchNaN(solve(rem(node, tokenizedGlobals)))));
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
