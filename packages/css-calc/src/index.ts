import { stringify, tokenizer } from '@csstools/css-tokenizer';
import { isFunctionNode, isSimpleBlockNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { solve } from './calculation';
import { abs, calc, clamp, cos, max, min, mod, rem, round, sign, sin, tan } from './functions/calc';
import { GlobalsWithStrings, tokenizeGlobals } from './util/globals';
import { patchCalcResult } from './util/patch-result';

const mathFunctions = new Map([
	['abs', abs],
	['calc', calc],
	['clamp', clamp],
	['cos', cos],
	['max', max],
	['min', min],
	['mod', mod],
	['rem', rem],
	['round', round],
	['sign', sign],
	['sin', sin],
	['tan', tan],
]);

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
				const mathFunction = mathFunctions.get(componentValue.getName().toLowerCase());
				if (mathFunction) {
					const calcResult = patchCalcResult(solve(mathFunction(componentValue, tokenizedGlobals)));
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
					const mathFunction = mathFunctions.get(node.getName().toLowerCase());
					if (!mathFunction) {
						return;
					}

					const calcResult = patchCalcResult(solve(mathFunction(node, tokenizedGlobals)));
					if (calcResult !== -1) {
						entry.parent.value.splice(index, 1, calcResult);
						return;
					}
				}
			});
		}
	}

	return result.map((componentValues) => {
		return componentValues.map((x) => stringify(...x.tokens())).join('');
	}).join(',');
}
