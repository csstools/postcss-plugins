import type { AtRule, ChildNode, Container, Declaration, Document, Node, Rule } from 'postcss';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { findAllStyleRules, findPrivateRule, findStyleRule, IS_PRIVATE_RULE_REGEX } from './valid-atrules';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues, stringify, walk } from '@csstools/css-parser-algorithms';
import { rewritePropertyNames } from '@csstools/utilities';

const HAS_VAR_OR_IF_FUNCTION_REGEX = /\b(var|if)\(/i;
const IS_CONTAINER_REGEX = /^container$/i;
const IS_LAYER_REGEX = /^layer$/i;
const IS_PROPERTY_REGEX = /^property$/i;
const IS_STYLE_FUNCTION_REGEX = /^style$/i;
const IS_VAR_FUNCTION_REGEX = /^var$/i;
const IS_CONDITIONAL_GROUP_RULE_REGEX = /^(container|media|starting-style|supports)$/i;
const IS_NESTING_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;
const IS_NON_HOISTABLE_CONDITIONAL_REGEX = /^(container|starting-style)$/i;

export class Transpiler {
	privateForRule: WeakMap<Rule | AtRule, { prefix: string, privateProperties: Set<string> }> = new Map();

	private nonHoistableOwners: WeakMap<Rule | AtRule, boolean> = new Map();

	counter = 0;

	hashes = new Map<string, string>();

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

		let fromHash;
		if (rule.source?.input.from) {
			fromHash = this.hashes.get(rule.source.input.from);

			if (!fromHash) {
				fromHash = sourceHashFor(rule.source.input.from);
				this.hashes.set(rule.source.input.from, fromHash);
			}
		} else {
			fromHash = '0';
		}

		const prefix = `--_csstools-p-${fromHash}-${this.counter.toString(36)}`;
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
		const propertyRules = collectPropertyRules(atRule);

		this.extractPropertyRules(propertyRules, prefix, privateProperties, ancestorConditionals);

		if (!atRule.nodes?.length) {
			this.removePrivateRule(atRule, ownerNode);
			return;
		}

		atRule.walk((node) => {
			if (node.type === 'decl' && node.variable && node.prop.startsWith('--')) {
				const name = unescapedPropertyName(node.prop);
				if (name !== null) {
					privateProperties.add(name);
				}

				node.prop = `${prefix}${node.prop}`;

				return;
			}

			if (node.type === 'atrule' && findPrivateRule(node) === atRule) {
				// nesting group rules are allowed inside private.
				// these are allowed if we can find a private at rule from the current node
				// and it is the same private at rule as what we started with.
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
	 * Whether any `@private` rule for this style rule has a registration that
	 * can not be hoisted to the root.
	 *
	 * A private property name is scoped to the style rule, so all private rules
	 * of a style rule must be transpiled or none of them.
	 */
	private hasNonHoistableRegistration(ownerNode: AtRule | Rule): boolean {
		const cached = this.nonHoistableOwners.get(ownerNode);
		if (cached !== undefined) {
			return cached;
		}

		let skip = false;

		ownerNode.walkAtRules(IS_PRIVATE_RULE_REGEX, (atRule) => {
			if (skip || findStyleRule(atRule) !== ownerNode) {
				return;
			}

			if (collectConditionalAncestors(atRule, ownerNode).some(isNonHoistableConditional)) {
				skip = true;
				return;
			}

			const propertyRules = collectPropertyRules(atRule);
			if (propertyRules.some(({ conditionals }) => conditionals.some(isNonHoistableConditional))) {
				skip = true;
			}
		});

		this.nonHoistableOwners.set(ownerNode, skip);

		return skip;
	}

	/**
	 * Move `@property` rules to the root with the generated private property
	 * names, so they provide the registration for the private properties.
	 */
	private extractPropertyRules(propertyRules: Array<CollectedPropertyRule>, prefix: string, privateProperties: Set<string>, ancestorConditionals: Array<AtRule>): void {
		for (const { propertyRule, conditionals } of propertyRules) {
			// `@property` rules can not be written in a style rule, so invalid
			// rules are dropped along with the rest of the private rule.
			propertyRule.remove();

			const registration = propertyRule.clone();
			const names = rewritePropertyNames(registration, (name) => `${prefix}${name}`);
			if (!names) {
				continue;
			}

			for (const name of names) {
				privateProperties.add(name);
			}

			this.registrations.push(...wrapInConditionals([registration], [...ancestorConditionals, ...conditionals]));
		}
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
		if (!HAS_VAR_OR_IF_FUNCTION_REGEX.test(decl.value)) return;

		const styleRulesWithPrivateProperties = this.getStyleRulesWithPrivateProperties(decl);

		if (!styleRulesWithPrivateProperties.length) return;

		const componentValues = parseListOfComponentValues(tokenize({ css: decl.value }));

		walk(componentValues, (entry) => {
			if (!isFunctionNode(entry.node)) {
				return;
			}

			if (IS_VAR_FUNCTION_REGEX.test(entry.node.getName())) {
				const args = entry.node.value;
				for (let i = 0; i < args.length; i++) {
					const arg = args[i];

					if (isWhiteSpaceOrCommentNode(arg)) continue;

					if (!isTokenNode(arg) || !isTokenIdent(arg.value) || !arg.value[4].value.startsWith('--')) break;

					const propertyName = arg.value[4].value;
					let foundPrefix: string | false = false;

					for (const { prefix, privateProperties } of styleRulesWithPrivateProperties) {
						if (privateProperties.has(propertyName)) {
							foundPrefix = prefix;
							break;
						}
					}

					if (!foundPrefix) break;

					mutateIdent(arg.value, `${foundPrefix}${arg.value[4].value}`);
					break;
				}

				return;
			}

			if (IS_STYLE_FUNCTION_REGEX.test(entry.node.getName())) {
				this.rewritePrivatePropertyName(entry.node, styleRulesWithPrivateProperties);
			}
		});

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

		walk(componentValues, (entry) => {
			if (!isFunctionNode(entry.node)) return;

			if (!IS_STYLE_FUNCTION_REGEX.test(entry.node.getName())) return;

			this.rewritePrivatePropertyName(entry.node, styleRulesWithPrivateProperties);
		});

		const replacement = stringify([componentValues]);
		if (replacement === atRule.params) {
			return;
		}

		atRule.params = replacement;
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

type CollectedPropertyRule = {
	propertyRule: AtRule,
	conditionals: Array<AtRule>,
};

/**
 * Collect the `@property` rules of a private rule.
 *
 * `@property` rules may be nested in the same nesting group rules that are
 * allowed inside `@private`.
 */
function collectPropertyRules(atRule: AtRule, conditionals: Array<AtRule> = [], out: Array<CollectedPropertyRule> = []): Array<CollectedPropertyRule> {
	for (const node of atRule.nodes || []) {
		if (node.type !== 'atrule') {
			continue;
		}

		if (IS_PROPERTY_REGEX.test(node.name)) {
			out.push({ propertyRule: node, conditionals });
			continue;
		}

		if (IS_NESTING_GROUP_RULE_REGEX.test(node.name)) {
			collectPropertyRules(node, IS_CONDITIONAL_GROUP_RULE_REGEX.test(node.name) ? [...conditionals, node] : conditionals, out);
		}
	}

	return out;
}

/** Wrap nodes in clones of the conditional group rules that contain them. */
function wrapInConditionals(nodes: Array<AtRule>, conditionals: Array<AtRule>): Array<AtRule> {
	let current = nodes;

	for (let i = conditionals.length - 1; i >= 0; i--) {
		current = [conditionals[i].clone({ nodes: current })];
	}

	return current;
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

/**
 * A short, stable hash of a stylesheet source path.
 *
 * Generated names embed this hash so that names from different stylesheets can
 * not collide. Only the last two path segments are used, so that names are
 * stable regardless of the absolute location of a project.
 *
 * This intentionally avoids `node:crypto` and `node:path` so that this plugin
 * can run in a browser bundle.
 */
function sourceHashFor(from: string): string {
	let hash = 2166136261;
	const source = sourceKey(from);

	for (let i = 0; i < source.length; i++) {
		hash ^= source.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}

	return (hash >>> 0).toString(36);
}

function sourceKey(from: string): string {
	const segments = from.replaceAll('\\', '/').split('/').filter((segment) => segment.length > 0);

	if (segments.length === 0) {
		return '.';
	}

	if (segments.length === 1) {
		return `./${segments[0]}`;
	}

	return segments.slice(-2).join('/');
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
