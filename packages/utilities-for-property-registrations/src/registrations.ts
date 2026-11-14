import type { AtRule, ChildNode, Container } from 'postcss';
import type { ComponentValue, TokenNode } from '@csstools/css-parser-algorithms';
import type { TokenIdent } from '@csstools/css-tokenizer';
import { isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';

const IS_PROPERTY_REGEX = /^property$/i;

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

export type CollectedPropertyRegistration = {
	atRule: AtRule,
	conditionals: Array<AtRule>,
};

export type CollectPropertyRegistrationsOptions = {
	isConditional: (atRule: AtRule) => boolean,
	shouldDescend: (atRule: AtRule) => boolean,
};

export type HoistPropertyRegistrationsOptions = {
	rewrite: (name: string) => string,
	conditionals?: Array<AtRule>,
	removeOriginal?: boolean,
};

export type HoistedPropertyRegistrations = {
	registrations: Array<AtRule>,
	names: Array<string>,
};

/** Collect the `@property` rules of a container, with the conditionals around each rule. */
export function collectPropertyRegistrations(
	container: Container<ChildNode>,
	options: CollectPropertyRegistrationsOptions,
): Array<CollectedPropertyRegistration> {
	return collectPropertyRegistrationsFrom(container, options, []);
}

function collectPropertyRegistrationsFrom(
	container: Container<ChildNode>,
	options: CollectPropertyRegistrationsOptions,
	conditionals: Array<AtRule>,
): Array<CollectedPropertyRegistration> {
	const out: Array<CollectedPropertyRegistration> = [];

	for (const node of container.nodes || []) {
		if (node.type !== 'atrule') {
			continue;
		}

		if (IS_PROPERTY_REGEX.test(node.name)) {
			out.push({ atRule: node, conditionals });
			continue;
		}

		if (!options.shouldDescend(node)) {
			continue;
		}

		out.push(...collectPropertyRegistrationsFrom(
			node,
			options,
			options.isConditional(node) ? [...conditionals, node] : conditionals,
		));
	}

	return out;
}

/** Clone, rename, wrap and format `@property` rules so they can be moved to the root. */
export function hoistPropertyRegistrations(
	collected: Array<CollectedPropertyRegistration>,
	options: HoistPropertyRegistrationsOptions,
): HoistedPropertyRegistrations {
	const registrations: Array<AtRule> = [];
	const names: Array<string> = [];
	const conditionals = options.conditionals || [];

	for (const { atRule, conditionals: nested } of collected) {
		if (options.removeOriginal) {
			atRule.remove();
		}

		const registration = atRule.clone();
		const rewritten = rewritePropertyNames(registration, options.rewrite);
		if (!rewritten) {
			continue;
		}

		names.push(...rewritten);

		const wrapped = wrapInConditionals([registration], [...conditionals, ...nested]);
		for (const node of wrapped) {
			formatGeneratedNode(node, '\n\n', '');
		}

		registrations.push(...wrapped);
	}

	return { registrations, names };
}

/** Wrap nodes in clones of the conditional group rules that contain them. */
export function wrapInConditionals<T extends ChildNode>(nodes: Array<T>, conditionals: Array<AtRule>): Array<T> {
	let current = nodes;

	for (let i = conditionals.length - 1; i >= 0; i--) {
		current = [conditionals[i].clone({ nodes: current })] as Array<T>;
	}

	return current;
}

/** Format a generated node tree. */
export function formatGeneratedNode(node: ChildNode, before: string, indent: string): void {
	node.cleanRaws(true);
	node.raws.before = before;

	if (node.type === 'decl' || node.type === 'comment') {
		return;
	}

	const childIndent = `${indent}\t`;
	for (const child of node.nodes || []) {
		formatGeneratedNode(child, `\n${childIndent}`, childIndent);
	}
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
