import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, parseComponentValue, stringify } from '@csstools/css-parser-algorithms';
import { isTokenColon, isTokenIdent, tokenize } from '@csstools/css-tokenizer';
import type { AtRule } from 'postcss';

export type MixinParameter = {
	name: string,
	defaultValue: string | undefined,
};

export type ProcessableMixin = {
	name: string,
	parameters: Array<MixinParameter>,
};

const IS_UNSUPPORTED_CHILD_RULE = /^result$/i;
const IS_IMPORTANT_REGEX = /!\s*important/i;

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

		const parsedParameters = parseParameters(prelude.value);
		if (!parsedParameters) {
			return false;
		}

		parameters = parsedParameters;
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

function parseParameters(componentValues: Array<ComponentValue>): false | Array<MixinParameter> {
	const rawParameters = parseCommaSeparatedListOfComponentValues(componentValues.flatMap((componentValue) => componentValue.tokens()));

	// `--foo()` has no parameters.
	if (rawParameters.length === 1 && stringify([rawParameters[0]]).trim() === '') {
		return [];
	}

	const parameters: Array<MixinParameter> = [];
	const names = new Set<string>();

	for (const rawParameter of rawParameters) {
		let start = 0;
		while (start < rawParameter.length && isWhiteSpaceOrCommentNode(rawParameter[start])) {
			start++;
		}

		const nameNode = rawParameter[start];
		if (!nameNode || !isTokenNode(nameNode) || !isTokenIdent(nameNode.value) || !nameNode.value[4].value.startsWith('--')) {
			return false;
		}

		const name = nameNode.value[4].value;
		if (names.has(name)) {
			return false;
		}

		names.add(name);

		let defaultValue: string | undefined;
		let hasType = false;

		for (let i = start + 1; i < rawParameter.length; i++) {
			const componentValue = rawParameter[i];

			if (isWhiteSpaceOrCommentNode(componentValue)) {
				continue;
			}

			if (isTokenNode(componentValue) && isTokenColon(componentValue.value)) {
				defaultValue = stringify([rawParameter.slice(i + 1)]).trim() || undefined;
				break;
			}

			hasType = true;
		}

		// TODO: support typed arguments
		if (hasType) {
			return false;
		}

		if (defaultValue && IS_IMPORTANT_REGEX.test(defaultValue)) {
			return false;
		}

		parameters.push({
			name,
			defaultValue,
		});
	}

	return parameters;
}
