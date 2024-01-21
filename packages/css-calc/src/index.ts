export type { conversionOptions, GlobalsWithStrings } from './options';
import type { conversionOptions } from './options';
import { ComponentValue, isFunctionNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { mathFunctions } from './functions/calc';
import { patchCalcResult } from './util/patch-result';
import { replaceComponentValues } from '@csstools/css-parser-algorithms';
import { solve } from './calculation';
import { stringify, tokenize } from '@csstools/css-tokenizer';
import { toLowerCaseAZ } from './util/to-lower-case-a-z';
import { tokenizeGlobals } from './util/globals';

export function calc(css: string, options?: conversionOptions): string {
	const result = parseCommaSeparatedListOfComponentValues(tokenize({css: css}), {});

	return calcFromComponentValues(result, options).map((componentValues) => {
		return componentValues.map((x) => stringify(...x.tokens())).join('');
	}).join(',');
}

export function calcFromComponentValues(componentValuesList: Array<Array<ComponentValue>>, options?: conversionOptions) {
	const tokenizedGlobals = tokenizeGlobals(options?.globals);

	return replaceComponentValues(componentValuesList, (componentValue) => {
		if (!isFunctionNode(componentValue)) {
			return;
		}

		const mathFunction = mathFunctions.get(toLowerCaseAZ(componentValue.getName()));
		if (!mathFunction) {
			return;
		}

		const calcResult = patchCalcResult(solve(mathFunction(componentValue, tokenizedGlobals)), options);
		if (calcResult !== -1) {
			return calcResult;
		}
	});
}

// Exposed so upstream dependents can use the same set of math functions.
export const mathFunctionNames = new Set(mathFunctions.keys());
