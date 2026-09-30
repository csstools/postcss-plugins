import type { AtRule } from 'postcss';
import type { CustomFunction, FunctionParameter } from '@csstools/custom-function-parser';
import { isTokenIdent, tokenize } from '@csstools/css-tokenizer';
import { CSS_WIDE_KEYWORDS } from './css-wide-keywords';
import { isComputationallyIndependent } from './is-computationally-independent';

/**
 * The type of a parameter, or `null` when it is untyped.
 *
 * `type(*)` is the universal syntax and counts as untyped.
 */
export function parameterType(parameter: FunctionParameter): string | null {
	const type = parameter.getArgumentType();
	return !!type && type !== '*' ? type : null;
}

/**
 * The return type of a custom function, or `null` when it has none.
 *
 * `type(*)` is the default return type and counts as no return type.
 */
function returnType(customFunction: CustomFunction): string | null {
	const type = customFunction.getReturnType();
	return !!type && type !== '*' ? type : null;
}

/**
 * The result of classifying a `@function` definition.
 */
export type FunctionClassification = {
	/** Whether the definition can be transpiled by this plugin. */
	supported: boolean;
	/**
	 * The CSS-wide keyword returned by a static `result` descriptor, or `null`.
	 * Only set when the definition has a single, unconditional keyword result.
	 */
	keywordResult: string | null;
	/**
	 * Whether any `result` descriptor resolves to a CSS-wide keyword, including
	 * inside conditional rules or `var()` fallbacks.
	 */
	hasKeywordResult: boolean;
};

/**
 * Decide how a single `@function` definition must be handled.
 *
 * A definition is supported when it has no return type and every parameter is
 * either untyped (with or without a default) or typed with a computationally
 * independent default value. Typed parameters without defaults are not
 * supported yet.
 */
export function classifyCustomFunction(atRule: AtRule, customFunction: CustomFunction): FunctionClassification {
	return {
		supported: isSupportedCustomFunction(customFunction),
		keywordResult: staticKeywordResult(atRule),
		hasKeywordResult: hasKeywordResult(atRule),
	};
}

function isSupportedCustomFunction(customFunction: CustomFunction): boolean {
	if (returnType(customFunction)) {
		return false;
	}

	return customFunction.parameters.every((parameter) => {
		if (!parameterType(parameter)) {
			// Untyped parameters, with or without a default, are supported.
			return true;
		}

		// A typed default becomes the `initial-value` of the generated
		// `@property` registration and must be computationally independent.
		const defaultValue = parameter.getDefaultValue();
		return !!defaultValue && isComputationallyIndependent(defaultValue);
	});
}

/**
 * The keyword a static `result` descriptor evaluates to.
 *
 * When the winning `result` descriptor is a CSS-wide keyword and no conditional
 * rule can change it, the call evaluates to that keyword directly instead of
 * being substituted through a custom property.
 */
function staticKeywordResult(atRule: AtRule): string | null {
	let hasConditionalResult = false;
	atRule.walkAtRules((child) => {
		child.walkDecls((decl) => {
			if (decl.prop.toLowerCase() === 'result') {
				hasConditionalResult = true;
			}
		});
	});

	if (hasConditionalResult) {
		return null;
	}

	let value: string | null = null;
	for (const node of atRule.nodes || []) {
		if (node.type === 'decl' && node.prop.toLowerCase() === 'result') {
			value = node.value.trim();
		}
	}

	if (!value) {
		return null;
	}

	if (CSS_WIDE_KEYWORDS.has(value.toLowerCase())) {
		return value;
	}

	return null;
}

/**
 * Whether a `result` descriptor resolves to a CSS-wide keyword anywhere,
 * including inside conditional rules or `var()` fallbacks.
 *
 * Such a result can not be substituted through a custom property.
 */
function hasKeywordResult(atRule: AtRule): boolean {
	let found = false;

	atRule.walkDecls((decl) => {
		if (decl.prop.toLowerCase() !== 'result') {
			return;
		}

		for (const token of tokenize({ css: decl.value })) {
			if (isTokenIdent(token) && CSS_WIDE_KEYWORDS.has(token[4].value.toLowerCase())) {
				found = true;
			}
		}
	});

	return found;
}
