import { isFunctionNode, isTokenNode, parseComponentValue } from '@csstools/css-parser-algorithms';
import { isTokenIdent } from '@csstools/css-tokenizer';
import type { AtRule } from 'postcss';
import { parseFunctionParameters } from '@csstools/custom-function-parser';
import { preludeTokens, rawParams } from './utils';

export type MixinParameter = {
	name: string,
	defaultValue: string | undefined,
};

export type ProcessableMixin = {
	name: string,
	parameters: Array<MixinParameter>,
};

/**
 * The dashed name in a `@mixin` or `@apply` prelude, even when the rule is not
 * transpilable.
 */
export function dashedNameFromParams(params: string): string | null {
	if (!params) {
		return null;
	}

	const prelude = parseComponentValue(preludeTokens(params));

	let name: string;
	if (isTokenNode(prelude) && isTokenIdent(prelude.value)) {
		// `@mixin --foo;` is equivalent to `@mixin --foo();`
		name = prelude.value[4].value;
	} else if (isFunctionNode(prelude)) {
		name = prelude.getName();
	} else {
		return null;
	}

	return name.startsWith('--') ? name : null;
}

/**
 * The name of a `@mixin` rule, even when the rule is not transpilable.
 */
export function mixinRuleName(atRule: AtRule): string | null {
	if (atRule.name.toLowerCase() !== 'mixin') {
		return null;
	}

	return dashedNameFromParams(rawParams(atRule));
}

export function processableMixinRule(atRule: AtRule): false | ProcessableMixin {
	const name = mixinRuleName(atRule);
	if (!name) {
		return false;
	}

	if (atRule.nodes === undefined) {
		return false;
	}

	// TODO: support conditional @mixin declarations
	if (atRule.parent !== atRule.root()) {
		return false;
	}

	const prelude = parseComponentValue(preludeTokens(rawParams(atRule)));

	let parameters: Array<MixinParameter> = [];

	if (isFunctionNode(prelude)) {
		const parsedParameters = parseFunctionParameters(prelude.value);
		if (!parsedParameters || parsedParameters.some((parameter) => {
			const type = parameter.getParameterType();
			return !!type && type !== '*';
		})) {
			return false;
		}

		parameters = parsedParameters.map((parameter) => ({
			name: parameter.getName(),
			defaultValue: parameter.getDefaultValue() ?? undefined,
		}));
	}

	return {
		name,
		parameters,
	};
}
