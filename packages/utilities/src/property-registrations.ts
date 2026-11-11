import type { AtRule } from 'postcss';
import type { ComponentValue, TokenNode } from '@csstools/css-parser-algorithms';
import type { TokenIdent } from '@csstools/css-tokenizer';
import { isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';

/**
 * Rewrite the custom property names in the prelude of an `@property` rule.
 *
 * Both the longhand comma separated prelude list and the shorthand form are
 * supported:
 *
 * ```css
 * @property --a, --b { syntax: "<length>"; }
 * @property --a <length>: 1em;
 * ```
 *
 * Returns the original names, or `null` when the rule is invalid.
 */
export function rewritePropertyNames(atRule: AtRule, rewrite: (name: string) => string): Array<string> | null {
	const parsed = parsePropertyNames(atRule);
	if (!parsed) {
		return null;
	}

	const names = parsed.names.map((name) => name.name);
	const nameNodes = new Set<ComponentValue>(parsed.names.map((name) => name.node));

	const replaced = replaceComponentValues(parsed.groups, (componentValue) => {
		if (!isTokenNode(componentValue) || !isTokenIdent(componentValue.value) || !nameNodes.has(componentValue)) {
			return;
		}

		mutateIdent(componentValue.value, rewrite(componentValue.value[4].value));
	});

	atRule.params = stringify(replaced);

	return names;
}

/** The names of every property registered by an `@property` rule. */
export function registeredPropertyNames(atRule: AtRule): Array<string> {
	return parsePropertyNames(atRule)?.names.map((name) => name.name) ?? [];
}

type PropertyName = {
	node: TokenNode,
	name: string,
};

type ParsedPropertyNames = {
	groups: Array<Array<ComponentValue>>,
	names: Array<PropertyName>,
};

function parsePropertyNames(atRule: AtRule): ParsedPropertyNames | null {
	const groups = parseCommaSeparatedListOfComponentValues(tokenize({ css: atRule.params }));

	if (!atRule.nodes) {
		const name = firstPropertyName(groups[0]);

		return name ? { groups, names: [name] } : null;
	}

	const names: Array<PropertyName> = [];

	for (const values of groups) {
		const name = propertyName(values);
		if (!name) {
			return null;
		}

		names.push(name);
	}

	return names.length ? { groups, names } : null;
}

/** Parse a single custom property name. */
function propertyName(values: Array<ComponentValue>): PropertyName | null {
	let name: PropertyName | null = null;

	for (const value of values) {
		if (isWhiteSpaceOrCommentNode(value)) {
			continue;
		}

		if (name !== null || !isTokenNode(value)) {
			return null;
		}

		const token = dashedIdent(value);
		if (!token) {
			return null;
		}

		name = {
			node: value,
			name: token[4].value,
		};
	}

	return name;
}

/** Parse the leading custom property name of a shorthand rule. */
function firstPropertyName(values: Array<ComponentValue> | undefined): PropertyName | null {
	for (const value of values || []) {
		if (isWhiteSpaceOrCommentNode(value)) {
			continue;
		}

		if (!isTokenNode(value)) {
			return null;
		}

		const token = dashedIdent(value);
		if (!token) {
			return null;
		}

		return {
			node: value,
			name: token[4].value,
		};
	}

	return null;
}

function dashedIdent(value: TokenNode): TokenIdent | null {
	if (!isTokenIdent(value.value)) {
		return null;
	}

	const name = value.value[4].value;

	return name !== '--' && name.startsWith('--') ? value.value : null;
}
