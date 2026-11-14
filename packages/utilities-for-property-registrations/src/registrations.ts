import type { AtRule, ChildNode, Container } from 'postcss';
import type { ComponentValue, TokenNode } from '@csstools/css-parser-algorithms';
import type { TokenIdent } from '@csstools/css-tokenizer';
import { isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';

const IS_PROPERTY_RULE_REGEX = /^property$/i;

/**
 * Rewrite the `<custom-property-name>` values in the prelude of an `@property` rule.
 *
 * Supports both the rule form and the statement form.
 *
 * @param atRule - The `@property` rule.
 * @param rewriteCustomPropertyName - Maps each original name to its new name.
 * @returns The original `<custom-property-name>` values, or `null` when the prelude cannot be parsed.
 */
export function rewriteCustomPropertyNames(atRule: AtRule, rewriteCustomPropertyName: (name: string) => string): Array<string> | null {
	const parsed = parseCustomPropertyNames(atRule);
	if (!parsed) {
		return null;
	}

	const originalNames = parsed.customPropertyNames.map((customPropertyName) => customPropertyName.name);

	for (const customPropertyName of parsed.customPropertyNames) {
		mutateIdent(customPropertyName.token, rewriteCustomPropertyName(customPropertyName.name));
	}

	atRule.params = stringify(parsed.preludeGroups);

	return originalNames;
}

/**
 * The `<custom-property-name>` values registered by an `@property` rule.
 *
 * @param atRule - The `@property` rule.
 */
export function registeredCustomPropertyNames(atRule: AtRule): Array<string> {
	return parseCustomPropertyNames(atRule)?.customPropertyNames.map((customPropertyName) => customPropertyName.name) ?? [];
}

/** An `@property` rule and the conditional group rules around it. */
export interface CollectedPropertyRegistration {
	/** The `@property` rule. */
	propertyRule: AtRule;
	/** The conditional group rules around the `@property` rule, outermost first. */
	conditionalGroupRules: Array<AtRule>;
}

/** Options for collecting `@property` rules. */
export interface CollectPropertyRegistrationsOptions {
	/** Whether an at-rule is a conditional group rule. */
	isConditionalGroupRule: (atRule: AtRule) => boolean;
	/** Whether to descend into an at-rule to find nested `@property` rules. */
	shouldDescendInto: (atRule: AtRule) => boolean;
}

/** Options for hoisting `@property` rules. */
export interface HoistPropertyRegistrationsOptions {
	/** The new `<custom-property-name>` for each original name. */
	rewriteCustomPropertyName: (name: string) => string;
	/** Conditional group rules to wrap every registration in, outermost first. */
	conditionalGroupRules?: Array<AtRule>;
	/** Whether to remove the collected `@property` rules. */
	removeOriginal?: boolean;
}

/** The hoisted `@property` rules and their original names. */
export interface HoistedPropertyRegistrations {
	/** The cloned, rewritten and wrapped `@property` rules. */
	registrations: Array<AtRule>;
	/** The `<custom-property-name>` values from before rewriting. */
	originalNames: Array<string>;
}

/**
 * Collect the `@property` rules in a container and the conditional group rules around each rule.
 *
 * @param container - The container to search.
 * @param options - The collection policy.
 */
export function collectPropertyRegistrations(
	container: Container<ChildNode>,
	options: CollectPropertyRegistrationsOptions,
): Array<CollectedPropertyRegistration> {
	return collectPropertyRegistrationsFrom(container, options, []);
}

function collectPropertyRegistrationsFrom(
	container: Container<ChildNode>,
	options: CollectPropertyRegistrationsOptions,
	conditionalGroupRules: Array<AtRule>,
): Array<CollectedPropertyRegistration> {
	const collected: Array<CollectedPropertyRegistration> = [];

	for (const node of container.nodes || []) {
		if (node.type !== 'atrule') {
			continue;
		}

		if (IS_PROPERTY_RULE_REGEX.test(node.name)) {
			collected.push({ propertyRule: node, conditionalGroupRules });
			continue;
		}

		if (!options.shouldDescendInto(node)) {
			continue;
		}

		collected.push(...collectPropertyRegistrationsFrom(
			node,
			options,
			options.isConditionalGroupRule(node) ? [...conditionalGroupRules, node] : conditionalGroupRules,
		));
	}

	return collected;
}

/**
 * Clone, rewrite and wrap `@property` rules so they can be moved to the root.
 *
 * @param collected - The collected registrations.
 * @param options - The hoisting policy.
 */
export function hoistPropertyRegistrations(
	collected: Array<CollectedPropertyRegistration>,
	options: HoistPropertyRegistrationsOptions,
): HoistedPropertyRegistrations {
	const registrations: Array<AtRule> = [];
	const originalNames: Array<string> = [];
	const conditionalGroupRules = options.conditionalGroupRules || [];

	for (const { propertyRule, conditionalGroupRules: nestedConditionalGroupRules } of collected) {
		if (options.removeOriginal) {
			propertyRule.remove();
		}

		const registration = propertyRule.clone();
		const originalRegistrationNames = rewriteCustomPropertyNames(registration, options.rewriteCustomPropertyName);
		if (!originalRegistrationNames) {
			continue;
		}

		originalNames.push(...originalRegistrationNames);

		registrations.push(...wrapInConditionalGroupRules([registration], [...conditionalGroupRules, ...nestedConditionalGroupRules]));
	}

	return { registrations, originalNames };
}

/**
 * Wrap nodes in clones of the given conditional group rules, outermost first.
 *
 * @param nodes - The nodes to wrap.
 * @param conditionalGroupRules - The rules to clone, outermost first.
 */
export function wrapInConditionalGroupRules<T extends ChildNode>(nodes: Array<T>, conditionalGroupRules: Array<AtRule>): Array<T | AtRule> {
	let current: Array<T | AtRule> = nodes;

	for (let i = conditionalGroupRules.length - 1; i >= 0; i--) {
		current = [conditionalGroupRules[i].clone({ nodes: current })];
	}

	return current;
}

type CustomPropertyName = {
	token: TokenIdent,
	name: string,
};

type ParsedCustomPropertyNames = {
	preludeGroups: Array<Array<ComponentValue>>,
	customPropertyNames: Array<CustomPropertyName>,
};

function parseCustomPropertyNames(atRule: AtRule): ParsedCustomPropertyNames | null {
	const preludeGroups = parseCommaSeparatedListOfComponentValues(tokenize({ css: atRule.params }));

	if (!atRule.nodes) {
		const customPropertyName = firstCustomPropertyName(preludeGroups[0]);

		return customPropertyName ? { preludeGroups, customPropertyNames: [customPropertyName] } : null;
	}

	const customPropertyNames: Array<CustomPropertyName> = [];

	for (const componentValues of preludeGroups) {
		const customPropertyName = parseCustomPropertyName(componentValues);
		if (!customPropertyName) {
			return null;
		}

		customPropertyNames.push(customPropertyName);
	}

	return customPropertyNames.length ? { preludeGroups, customPropertyNames } : null;
}

/** Parse a single `<custom-property-name>`. */
function parseCustomPropertyName(componentValues: Array<ComponentValue>): CustomPropertyName | null {
	let customPropertyName: CustomPropertyName | null = null;

	for (const componentValue of componentValues) {
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		if (customPropertyName !== null || !isTokenNode(componentValue)) {
			return null;
		}

		const token = dashedIdentToken(componentValue);
		if (!token) {
			return null;
		}

		customPropertyName = {
			token,
			name: token[4].value,
		};
	}

	return customPropertyName;
}

/** Parse the leading `<custom-property-name>` of a statement form. */
function firstCustomPropertyName(componentValues: Array<ComponentValue>): CustomPropertyName | null {
	for (const componentValue of componentValues) {
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		if (!isTokenNode(componentValue)) {
			return null;
		}

		const token = dashedIdentToken(componentValue);
		if (!token) {
			return null;
		}

		return {
			token,
			name: token[4].value,
		};
	}

	return null;
}

function dashedIdentToken(tokenNode: TokenNode): TokenIdent | null {
	if (!isTokenIdent(tokenNode.value)) {
		return null;
	}

	const name = tokenNode.value[4].value;

	return name !== '--' && name.startsWith('--') ? tokenNode.value : null;
}
