export type { conversionOptions, GlobalsWithStrings } from './options';
import type { conversionOptions } from './options';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
export { ParseError, ParseErrorWithComponentValues, ParseErrorMessage } from './error';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, sourceIndices, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { mathFunctions } from './functions/calc';
import { patchCalcResult } from './util/patch-result';
import { walk } from '@csstools/css-parser-algorithms';
import { solve } from './calculation';
import { isTokenColon, isTokenComma, isTokenDelim, isTokenSemicolon, stringify, tokenize, TokenType } from '@csstools/css-tokenizer';
import { tokenizeGlobals } from './util/globals';

export function calc(css: string, options?: conversionOptions): string {
	const result = parseCommaSeparatedListOfComponentValues(tokenize({css: css}), {});

	return calcFromComponentValues(result, options).map((componentValues) => {
		return componentValues.map((x) => stringify(...x.tokens())).join('');
	}).join(',');
}

export function calcFromComponentValues(componentValuesList: Array<Array<ComponentValue>>, options?: conversionOptions): Array<Array<ComponentValue>> {
	const tokenizedGlobals = tokenizeGlobals(options?.globals);

	return replaceComponentValues(componentValuesList, (componentValue) => {
		if (!isFunctionNode(componentValue)) {
			return;
		}

		const mathFunction = mathFunctions.get(componentValue.getName().toLowerCase());
		if (!mathFunction) {
			return;
		}

		const calcResult = patchCalcResult(solve(mathFunction(componentValue, tokenizedGlobals, options ?? {}), options ?? {}), options);
		if (calcResult !== -1) {
			return calcResult;
		}
	});
}

function replaceComponentValues(
	componentValuesList: Array<Array<ComponentValue>>,
	replaceWith: (componentValue: ComponentValue) => ComponentValue | void,
): Array<Array<ComponentValue>> {
	for (let i = 0; i < componentValuesList.length; i++) {
		const componentValues = componentValuesList[i];

		walk(componentValues, (entry, index) => {
			if (typeof index !== 'number') {
				return;
			}

			const replacement = replaceWith(entry.node);
			if (!replacement) {
				return;
			}

			const replacements = [replacement];

			const previousValue = entry.parent.value[index - 1];
			if (
				isTokenNode(previousValue) &&
				isTokenDelim(previousValue.value) &&
				(
					previousValue.value[4].value === '-' ||
					previousValue.value[4].value === '+'
				)
			) {
				replacements.splice(0, 0, new WhitespaceNode(
					[[TokenType.Whitespace, ' ', ...sourceIndices(entry.node), undefined]]
				));
			}

			const nextValue = entry.parent.value[index + 1];
			if (
				!(
					!nextValue ||
					isWhiteSpaceOrCommentNode(nextValue) ||
					(
						isTokenNode(nextValue) &&
						(
							isTokenComma(nextValue.value) ||
							isTokenColon(nextValue.value) ||
							isTokenSemicolon(nextValue.value) ||
							(
								isTokenDelim(nextValue.value) &&
								nextValue.value[4].value !== '-' &&
								nextValue.value[4].value !== '+'
							)
						)
					)
				)
			) {
				replacements.push(new WhitespaceNode(
					[[TokenType.Whitespace, ' ', ...sourceIndices(entry.node), undefined]]
				));
			}

			entry.parent.value.splice(index, 1, ...replacements);
		});
	}

	return componentValuesList;
}

// Exposed so upstream dependents can use the same set of math functions.
export const mathFunctionNames = new Set(mathFunctions.keys());
