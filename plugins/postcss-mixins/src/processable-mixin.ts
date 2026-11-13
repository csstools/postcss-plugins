import { isFunctionNode, isTokenNode, parseComponentValue } from '@csstools/css-parser-algorithms';
import { isTokenIdent, tokenize } from '@csstools/css-tokenizer';
import type { AtRule } from 'postcss';
import { parseFunctionParameters } from '@csstools/custom-function-parser';

export type MixinParameter = {
	name: string,
	defaultValue: string | undefined,
};

export type ProcessableMixin = {
	name: string,
	parameters: Array<MixinParameter>,
};

const IS_UNSUPPORTED_CHILD_RULE = /^result$/i;

export function processableMixinRule(atRule: AtRule): false | ProcessableMixin {
	if (atRule.name.toLowerCase() !== 'mixin') {
		return false;
	}

	if (!atRule.params || !atRule.params.includes('--')) {
		return false;
	}

	if (atRule.nodes === undefined) {
		return false;
	}

	// TODO: support conditional @mixin declarations
	if (atRule.parent !== atRule.root()) {
		return false;
	}

	// `@result` was dropped from the specification, mixins with `@result` are ignored.
	let hasUnsupportedChildRule = false;
	atRule.walk((node) => {
		if (node.type === 'atrule' && IS_UNSUPPORTED_CHILD_RULE.test(node.name)) {
			hasUnsupportedChildRule = true;
		}
	});

	if (hasUnsupportedChildRule) {
		return false;
	}

	const prelude = parseComponentValue(tokenize({
		css: atRule.params,
	}));

	let name: string;
	let parameters: Array<MixinParameter> = [];

	if (isTokenNode(prelude) && isTokenIdent(prelude.value)) {
		// `@mixin --foo;` is equivalent to `@mixin --foo();`
		name = prelude.value[4].value;
	} else if (isFunctionNode(prelude)) {
		name = prelude.getName();

		const parsedParameters = parseFunctionParameters(prelude.value);
		if (!parsedParameters || parsedParameters.some((parameter) => parameter.getArgumentType())) {
			return false;
		}

		parameters = parsedParameters.map((parameter) => ({
			name: parameter.getName(),
			defaultValue: parameter.colon === null ? undefined : parameter.getDefaultValue(),
		}));
	} else {
		return false;
	}

	if (!name.startsWith('--')) {
		return false;
	}

	return {
		name,
		parameters,
	};
}
