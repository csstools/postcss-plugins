import type { AtRule, ChildNode, Container, Declaration, Document, Node, Rule } from 'postcss';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { findAllStyleRules, findPrivateRule, IS_NESTING_GROUP_RULE_REGEX, IS_PRIVATE_RULE_REGEX } from './valid-atrules';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues, stringify, walk } from '@csstools/css-parser-algorithms';
import { generatedName } from '@csstools/generate-idents';
import { collectPropertyRegistrations, hoistPropertyRegistrations } from '@csstools/utilities-for-property-registrations';

const HAS_PRIVATE_REFERENCE_REGEX = /\b(var|if|style|inherit)\(/i;
const IS_CONTAINER_REGEX = /^container$/i;
const IS_LAYER_REGEX = /^layer$/i;
const IS_STYLE_FUNCTION_REGEX = /^style$/i;
const IS_INHERIT_FUNCTION_REGEX = /^inherit$/i;
const IS_VAR_FUNCTION_REGEX = /^var$/i;
const IS_CONDITIONAL_GROUP_RULE_REGEX = /^(container|media|starting-style|supports)$/i;
const IS_NON_HOISTABLE_CONDITIONAL_REGEX = /^(container|starting-style)$/i;

export class Transpiler {
	privateForRule: WeakMap<Rule | AtRule, { prefix: string, privateProperties: Set<string> }> = new Map();

	private nonHoistableOwners: WeakMap<Rule | AtRule, boolean> = new Map();

	counter = 0;

	namespace: string;

	constructor(namespace = 'p') {
		this.namespace = namespace;
	}

	/** `@property` registrations generated for private properties. */
	private registrations: Array<AtRule> = [];

	/**
	 * Take the `@property` registrations that were generated for private
	 * properties. These are top level rules and must be appended to the root.
	 */
	getRegisteredPropertyAtRules(): Array<AtRule> {
		const registrations = this.registrations;
		this.registrations = [];
		return registrations;
	}

	getOrFillPrivateForRule(rule: Rule | AtRule): { prefix: string, privateProperties: Set<string> } {
		const existing = this.privateForRule.get(rule);
		if (existing) {
			return existing;
		}

		const prefix = generatedName(this.namespace, rule.source?.input.from, this.counter.toString(36));
		this.counter++;

		const out: { prefix: string, privateProperties: Set<string> } = {
			prefix: prefix,
			privateProperties: new Set()
		};

		this.privateForRule.set(rule, out);

		return out;
	};

	getStyleRulesWithPrivateProperties(node: Node): Array<{ prefix: string, privateProperties: Set<string>, rule: Rule }> {
		return findAllStyleRules(node)
			.map((rule) => {
			const p = this.privateForRule.get(rule);
			if (!p) {
				return false;
			}

			return {
				prefix: p.prefix,
				privateProperties: p.privateProperties,
				rule: rule,
			};
			})
			.filter(Boolean)
			.reverse() as Array<{ prefix: string, privateProperties: Set<string>, rule: Rule }>;
	};

	registerAndRemovePrivateRules(atRule: AtRule, ownerNode: AtRule | Rule): void {
		if (!atRule.nodes?.length) {
			return;
		}

		// Private property names are scoped to the style rule. When a
		// registration for any of them can not be hoisted, the whole style rule
		// is left as-is so that all private properties stay consistent.
		if (this.hasNonHoistableRegistration(ownerNode)) {
			return;
		}

		const { prefix, privateProperties } = this.getOrFillPrivateForRule(ownerNode);
		const ancestorConditionals = collectConditionalAncestors(atRule, ownerNode);
		const propertyRegistrations = collectPropertyRegistrations(atRule, {
			isConditional: (node) => IS_CONDITIONAL_GROUP_RULE_REGEX.test(node.name),
			shouldDescend: (node) => IS_NESTING_GROUP_RULE_REGEX.test(node.name),
		});

		const { registrations, names } = hoistPropertyRegistrations(propertyRegistrations, {
			rewrite: (name) => `${prefix}${name}`,
			conditionals: ancestorConditionals,
			removeOriginal: true,
		});

		for (const name of names) {
			privateProperties.add(name);
		}

		this.registrations.push(...registrations);

		if (!atRule.nodes?.length) {
			this.removePrivateRule(atRule, ownerNode);
			return;
		}

		atRule.walk((node) => {
			if (node.type === 'decl') {
				// `!important` on a private declaration is invalid and ignored.
				if (node.important) {
					node.remove();
					return;
				}

				if (!node.variable || !node.prop.startsWith('--')) {
					node.remove();
					return;
				}

				const name = unescapedPropertyName(node.prop);
				if (name !== null) {
					privateProperties.add(name);
				}

				node.prop = `${prefix}${node.prop}`;

				return;
			}

			if (
				node.type === 'atrule' &&
				IS_NESTING_GROUP_RULE_REGEX.test(node.name) &&
				findPrivateRule(node) === atRule
			) {
				return;
			}

			// anything else is not allowed and we simply drop it.
			node.remove();
		});

		removeEmptyNestingGroupRules(atRule);

		if (!atRule.nodes?.length) {
			this.removePrivateRule(atRule, ownerNode);
			return;
		}

		// Insert as a batch: PostCSS resolves the index of `atRule` with
		// `indexOf` for every single `before()` call, which is quadratic.
		atRule.before(atRule.nodes.map((node) => node.clone()));
		this.removePrivateRule(atRule, ownerNode);
	}

	/**
	 * Remove a private rule and any conditional group rules that only
	 * contained it.
	 */
	private removePrivateRule(atRule: AtRule, ownerNode: AtRule | Rule): void {
		const parent = atRule.parent;
		atRule.remove();
		removeEmptyGroupingAncestors(parent, ownerNode);
	}

	/**
	 * Whether any `@private` rule in this style rule or its nested style rules
	 * has a registration that can not be hoisted to the root.
	 *
	 * A private property name is scoped to the style rule and is visible in all
	 * nested rules, so the whole subtree must be transpiled or none of it.
	 */
	private hasNonHoistableRegistration(ownerNode: AtRule | Rule): boolean {
		const cached = this.nonHoistableOwners.get(ownerNode);
		if (cached !== undefined) {
			return cached;
		}

		let skip = false;

		ownerNode.walkAtRules(IS_PRIVATE_RULE_REGEX, (atRule) => {
			if (skip) {
				return;
			}

			const propertyRegistrations = collectPropertyRegistrations(atRule, {
				isConditional: (node) => IS_CONDITIONAL_GROUP_RULE_REGEX.test(node.name),
				shouldDescend: (node) => IS_NESTING_GROUP_RULE_REGEX.test(node.name),
			});

			if (!propertyRegistrations.length) {
				return;
			}

			if (collectConditionalAncestors(atRule, ownerNode).some(isNonHoistableConditional)) {
				skip = true;
				return;
			}

			if (propertyRegistrations.some(({ conditionals }) => conditionals.some(isNonHoistableConditional))) {
				skip = true;
			}
		});

		this.nonHoistableOwners.set(ownerNode, skip);

		return skip;
	}

	transpileDeclaration(decl: Declaration): void {
		this.transpileDeclarationPropertyNames(decl);
		this.transpileDeclarationValues(decl);
	}

	transpileDeclarationPropertyNames(decl: Declaration): void {
		if (!decl.variable || !decl.prop.startsWith('--')) return;

		const propertyName = unescapedPropertyName(decl.prop);
		if (propertyName === null) return;

		const styleRulesWithPrivateProperties = this.getStyleRulesWithPrivateProperties(decl);

		if (!styleRulesWithPrivateProperties.length) return;

		let foundPrefix: string | false = false;

		for (const { prefix, privateProperties } of styleRulesWithPrivateProperties) {
			if (privateProperties.has(propertyName)) {
				foundPrefix = prefix;
				break;
			}
		}

		if (!foundPrefix) return;

		const replacement = `${foundPrefix}${decl.prop}`;

		if (decl.prop === replacement) return;

		decl.prop = replacement;
	}

	transpileDeclarationValues(decl: Declaration): void {
		if (!HAS_PRIVATE_REFERENCE_REGEX.test(decl.value)) return;

		const styleRulesWithPrivateProperties = this.getStyleRulesWithPrivateProperties(decl);

		if (!styleRulesWithPrivateProperties.length) return;

		const componentValues = parseListOfComponentValues(tokenize({ css: decl.value }));
		this.rewritePrivateReferences(componentValues, styleRulesWithPrivateProperties);

		const replacement = stringify([componentValues]);
		if (replacement === decl.value) {
			return;
		}

		decl.value = replacement;
	}

	transpileAtRule(atRule: AtRule): void {
		if (!IS_CONTAINER_REGEX.test(atRule.name)) return;

		if (!atRule.params.includes('--')) return;

		const styleRulesWithPrivateProperties = this.getStyleRulesWithPrivateProperties(atRule);

		if (!styleRulesWithPrivateProperties.length) return;

		const componentValues = parseListOfComponentValues(tokenize({ css: atRule.params }));
		this.rewritePrivateReferences(componentValues, styleRulesWithPrivateProperties);

		const replacement = stringify([componentValues]);
		if (replacement === atRule.params) {
			return;
		}

		atRule.params = replacement;
	}

	private rewritePrivateReferences(componentValues: Array<ComponentValue>, styleRulesWithPrivateProperties: Array<{ prefix: string, privateProperties: Set<string> }>): void {
		walk(componentValues, (entry) => {
			if (!isFunctionNode(entry.node)) {
				return;
			}

			const name = entry.node.getName();
			if (!IS_VAR_FUNCTION_REGEX.test(name) && !IS_STYLE_FUNCTION_REGEX.test(name) && !IS_INHERIT_FUNCTION_REGEX.test(name)) {
				return;
			}

			this.rewritePrivatePropertyName(entry.node, styleRulesWithPrivateProperties);
		});
	}

	private rewritePrivatePropertyName(node: FunctionNode, styleRulesWithPrivateProperties: Array<{ prefix: string, privateProperties: Set<string> }>): void {
		for (let i = 0; i < node.value.length; i++) {
			const arg = node.value[i];

			if (isWhiteSpaceOrCommentNode(arg)) continue;

			if (!isTokenNode(arg) || !isTokenIdent(arg.value) || !arg.value[4].value.startsWith('--')) return;

			const propertyName = arg.value[4].value;
			let foundPrefix: string | false = false;

			for (const { prefix, privateProperties } of styleRulesWithPrivateProperties) {
				if (privateProperties.has(propertyName)) {
					foundPrefix = prefix;
					break;
				}
			}

			if (!foundPrefix) return;

			mutateIdent(arg.value, `${foundPrefix}${arg.value[4].value}`);
			return;
		}
	}
}

/** Remove nesting group rules that no longer contain anything. */
function removeEmptyNestingGroupRules(container: AtRule): void {
	for (const node of container.nodes || []) {
		if (node.type !== 'atrule' || !IS_NESTING_GROUP_RULE_REGEX.test(node.name)) {
			continue;
		}

		removeEmptyNestingGroupRules(node);

		// Empty layers are kept: they still declare the layer order.
		if (IS_LAYER_REGEX.test(node.name)) {
			continue;
		}

		if (!node.nodes?.length) {
			node.remove();
		}
	}
}

/** Remove conditional group rules that only contained a removed private rule. */
function removeEmptyGroupingAncestors(node: Node | undefined, ownerNode: Node): void {
	while (node && node !== ownerNode) {
		const parent = node.parent;

		// Empty layers are kept: they still declare the layer order.
		if (
			node.type === 'atrule' &&
			IS_NESTING_GROUP_RULE_REGEX.test((node as AtRule).name) &&
			!IS_LAYER_REGEX.test((node as AtRule).name) &&
			!(node as AtRule).nodes?.length
		) {
			node.remove();
		}

		node = parent;
	}
}

/** Conditional group rules between a private rule and its owning style rule. */
function collectConditionalAncestors(atRule: AtRule, ownerNode: Node): Array<AtRule> {
	const conditionals: Array<AtRule> = [];
	let parent: Container<ChildNode> | Document | undefined = atRule.parent;

	while (parent && parent !== ownerNode) {
		if (parent.type === 'atrule' && IS_CONDITIONAL_GROUP_RULE_REGEX.test((parent as AtRule).name)) {
			conditionals.push(parent as AtRule);
		}

		parent = parent.parent;
	}

	return conditionals.reverse();
}

function isNonHoistableConditional(atRule: AtRule): boolean {
	return IS_NON_HOISTABLE_CONDITIONAL_REGEX.test(atRule.name);
}

/** The unescaped name of a custom property token. */
function unescapedPropertyName(property: string): string | null {
	const token = tokenize({ css: property })[0];
	if (!token || !isTokenIdent(token)) {
		return null;
	}

	return token[4].value;
}
