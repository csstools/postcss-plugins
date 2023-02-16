import { stringify, tokenizer } from '@csstools/css-tokenizer';
import { ComponentValue, isFunctionNode, isSimpleBlockNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { solve } from './calculation';
import { abs, acos, asin, atan, atan2, calc as calcInternal, clamp, cos, max, min, mod, rem, round, sign, sin, tan } from './functions/calc';
import { tokenizeGlobals } from './util/globals';
import { patchCalcResult } from './util/patch-result';

import type { conversionOptions } from './options';
export type { conversionOptions } from './options';

const mathFunctions = new Map([
	['abs', abs],
	['acos', acos],
	['asin', asin],
	['atan', atan],
	['atan2', atan2],
	['calc', calcInternal],
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

export function calc(css: string, options?: conversionOptions) {
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

	const result = parseCommaSeparatedListOfComponentValues(tokens, {});

	return calcFromComponentValues(result, options).map((componentValues) => {
		return componentValues.map((x) => stringify(...x.tokens())).join('');
	}).join(',');
}

export function calcFromComponentValues(componentValuesList: Array<Array<ComponentValue>>, options?: conversionOptions) {
	const tokenizedGlobals = tokenizeGlobals(options?.globals);

	for (let i = 0; i < componentValuesList.length; i++) {
		const componentValues = componentValuesList[i];

		for (let j = 0; j < componentValues.length; j++) {
			const componentValue = componentValues[j];

			if (isFunctionNode(componentValue)) {
				const mathFunction = mathFunctions.get(componentValue.getName().toLowerCase());
				if (mathFunction) {
					const calcResult = patchCalcResult(solve(mathFunction(componentValue, tokenizedGlobals)), options);
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

					const calcResult = patchCalcResult(solve(mathFunction(node, tokenizedGlobals)), options);
					if (calcResult !== -1) {
						entry.parent.value.splice(index, 1, calcResult);
						return;
					}
				}
			});
		}
	}

	return componentValuesList;
}
