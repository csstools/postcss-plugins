import type { AtRule, ChildNode, Container, Declaration, Document, Node, Rule } from 'postcss';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { findAllStyleRules, findPrivateRule, IS_NESTING_GROUP_RULE_REGEX } from './valid-atrules';
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
const IS_REGISTRATION_WRAPPER_REGEX = /^(layer|media|supports)$/i;

type PrivateForRule = {
	prefix: string,
	privateProperties: Set<string>,
};

export class Transpiler {
	privateForRule: WeakMap<Rule | AtRule, PrivateForRule> = new WeakMap();

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

	getOrFillPrivateForRule(rule: Rule | AtRule): PrivateForRule {
		const existing = this.privateForRule.get(rule);
		if (existing) {
			return existing;
		}

		const out: PrivateForRule = {
			prefix: generatedName(this.namespace, rule.source?.input.from, this.counter.toString(36)),
			privateProperties: new Set(),
		};

		this.counter++;
		this.privateForRule.set(rule, out);

		return out;
	}

	getStyleRulesWithPrivateProperties(node: Node): Array<PrivateForRule> {
		const styleRules = findAllStyleRules(node);
		const out: Array<PrivateForRule> = [];

		for (let i = (styleRules.length - 1); i >= 0; i--) {
			const privateForRule = this.privateForRule.get(styleRules[i]);
			if (privateForRule) {
				out.push(privateForRule);
			}
		}

		return out;
	}

	registerAndRemovePrivateRules(atRule: AtRule, ownerNode: AtRule | Rule): void {
		if (!atRule.nodes?.length) {
			return;
		}

		const { prefix, privateProperties } = this.getOrFillPrivateForRule(ownerNode);
		const ancestorConditionals = collectConditionalAncestors(atRule, ownerNode);
		const propertyRegistrations = collectPropertyRegistrations(atRule, {
			isConditional: (node) => IS_REGISTRATION_WRAPPER_REGEX.test(node.name),
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

	/** Remove a private rule and any conditional group rules that only contained it. */
	private removePrivateRule(atRule: AtRule, ownerNode: AtRule | Rule): void {
		const parent = atRule.parent;
		atRule.remove();
		removeEmptyGroupingAncestors(parent, ownerNode);
	}

	transpileDeclaration(decl: Declaration): void {
		this.transpileDeclarationPropertyNames(decl);
		this.transpileDeclarationValues(decl);
	}

	transpileDeclarationPropertyNames(decl: Declaration): void {
		if (!decl.variable || !decl.prop.startsWith('--')) return;

		const propertyName = unescapedPropertyName(decl.prop);
		if (propertyName === null) return;

		const prefix = findPrefix(this.getStyleRulesWithPrivateProperties(decl), propertyName);
		if (!prefix) return;

		const replacement = `${prefix}${decl.prop}`;

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

	private rewritePrivateReferences(componentValues: Array<ComponentValue>, styleRulesWithPrivateProperties: Array<PrivateForRule>): void {
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

	private rewritePrivatePropertyName(node: FunctionNode, styleRulesWithPrivateProperties: Array<PrivateForRule>): void {
		for (let i = 0; i < node.value.length; i++) {
			const arg = node.value[i];

			if (isWhiteSpaceOrCommentNode(arg)) continue;

			if (!isTokenNode(arg) || !isTokenIdent(arg.value) || !arg.value[4].value.startsWith('--')) return;

			const prefix = findPrefix(styleRulesWithPrivateProperties, arg.value[4].value);
			if (!prefix) return;

			mutateIdent(arg.value, `${prefix}${arg.value[4].value}`);

			return;
		}
	}
}

function findPrefix(styleRulesWithPrivateProperties: Array<PrivateForRule>, propertyName: string): string | false {
	for (const { prefix, privateProperties } of styleRulesWithPrivateProperties) {
		if (privateProperties.has(propertyName)) {
			return prefix;
		}
	}

	return false;
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
		if (parent.type === 'atrule' && IS_REGISTRATION_WRAPPER_REGEX.test((parent as AtRule).name)) {
			conditionals.push(parent as AtRule);
		}

		parent = parent.parent;
	}

	return conditionals.reverse();
}

/** The unescaped name of a custom property token. */
function unescapedPropertyName(property: string): string | null {
	const token = tokenize({ css: property })[0];
	if (!token || !isTokenIdent(token)) {
		return null;
	}

	return token[4].value;
}
