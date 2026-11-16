import type { AtRule, ChildNode, Container, Declaration, Document, Node, Rule } from 'postcss';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import type { TokenIdent } from '@csstools/css-tokenizer';
import { isTokenColon, isTokenDelim, isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, isSimpleBlockNode, isTokenNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues, stringify, walk } from '@csstools/css-parser-algorithms';
import { generateUniqueDashedIdent, hashFileBasenameAndDir } from '@csstools/generate-idents';
import { collectPropertyRegistrations, registeredCustomPropertyNames, rewriteCustomPropertyNames, wrapInConditionalGroupRules } from '@csstools/utilities-for-property-registrations';

const HAS_PRIVATE_REFERENCE_REGEX = /\b(var|if|style|inherit)\(/i;
const IS_APPLY_RULE_REGEX = /^apply$/i;
const IS_CONTAINER_RULE_REGEX = /^container$/i;
const IS_CONTENTS_RULE_REGEX = /^contents$/i;
const IS_FUNCTION_RULE_REGEX = /^function$/i;
const IS_INHERIT_FUNCTION_REGEX = /^inherit$/i;
const IS_KEYFRAMES_RULE_REGEX = /^keyframes$/i;
const IS_LAYER_RULE_REGEX = /^layer$/i;
const IS_MEDIA_RULE_REGEX = /^media$/i;
const IS_MIXIN_RULE_REGEX = /^mixin$/i;
const IS_NESTED_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;
const IS_PRIVATE_RULE_REGEX = /^private$/i;
const IS_PROPERTY_LIST_REGEX = /^(transition|transition-property)$/i;
const IS_PROPERTY_RULE_REGEX = /^property$/i;
const IS_STYLE_FUNCTION_REGEX = /^style$/i;
const IS_SUPPORTS_RULE_REGEX = /^supports$/i;
const IS_VAR_FUNCTION_REGEX = /^var$/i;

export type PrivatePropertyTranspilerOptions = {
	/** Namespace for generated names. */
	namespace?: string,
	/**
	 * Whether `@apply` and `@contents` rules in the nodes are expanded later.
	 *
	 * When `true`, style rules that contain them are still transpiled. This is
	 * used by `postcss-mixins`, which expands `@apply` and `@contents` itself.
	 * Defaults to `false`: style rules with `@apply` or `@contents` are left
	 * untouched because those can substitute declarations that reference
	 * private properties.
	 */
	allowUntranspiledMixins?: boolean,
	/**
	 * Keep `@private` rules and leave references inside `@apply` and `@contents`
	 * blocks alone.
	 *
	 * Transpiled declarations are still hoisted, so the original notation keeps
	 * working where `@private` is supported.
	 */
	preserve?: boolean,
};

export type PrivatePropertyTranspileOptions = {
	/**
	 * Style rule that owns the private property names of `nodes`.
	 *
	 * Use this when `nodes` are substituted into a style rule but are not its
	 * direct children, for example a `@contents` block that is authored at an
	 * `@apply` site and placed inside a mixin body.
	 */
	scope?: Rule,
};

type RulePrivatePropertyNames = {
	prefix: string,
	names: Set<string>,
};

export class Transpiler {
	private privatePropertyNames: WeakMap<Rule, RulePrivatePropertyNames> = new WeakMap();

	private processedPrivateRules: WeakSet<AtRule> = new WeakSet();

	private skippedStyleRules: WeakSet<Rule> = new WeakSet();

	private counter = 0;

	private namespace: string;

	private allowUntranspiledMixins: boolean;

	private preserve: boolean;

	private propertyRegistrations: Array<AtRule> = [];

	private scope: Rule | undefined;

	private scopeRules: Set<Rule> = new Set();

	constructor(options?: PrivatePropertyTranspilerOptions) {
		this.namespace = options?.namespace || 'p';
		this.allowUntranspiledMixins = options?.allowUntranspiledMixins === true;
		this.preserve = options?.preserve === true;
	}

	transpile(nodes: Array<ChildNode>, options?: PrivatePropertyTranspileOptions): Array<AtRule> {
		const previousScope = this.scope;
		const previousScopeRules = this.scopeRules;

		this.scope = options?.scope;
		this.scopeRules = collectRules(nodes);

		try {
			this.collectSkippedStyleRules(nodes);

			// Hoisted declarations can be inserted next to `nodes`, outside the
			// subtree that is walked below. Keep them so their values are still
			// rewritten against the correct scope.
			const hoisted: Array<Declaration> = [];

			for (const node of nodes) {
				if (node.type === 'atrule' && IS_PRIVATE_RULE_REGEX.test(node.name)) {
					hoisted.push(...this.transpilePrivateRule(node));
				}

				if (isContainer(node)) {
					node.walkAtRules(IS_PRIVATE_RULE_REGEX, (atRule) => {
						hoisted.push(...this.transpilePrivateRule(atRule));
					});
				}
			}

			for (const node of nodes) {
				if (node.type === 'decl') {
					this.transpileDeclaration(node);
					continue;
				}

				if (isContainer(node)) {
					node.walkDecls((decl) => this.transpileDeclaration(decl));
				}
			}

			for (const declaration of hoisted) {
				this.transpileDeclaration(declaration);
			}

			for (const node of nodes) {
				if (node.type === 'atrule') {
					this.transpileContainerRule(node);
					continue;
				}

				if (isContainer(node)) {
					node.walkAtRules((atRule) => this.transpileContainerRule(atRule));
				}
			}

			const registrations = this.propertyRegistrations;
			this.propertyRegistrations = [];
			return registrations;
		} finally {
			this.scope = previousScope;
			this.scopeRules = previousScopeRules;
		}
	}

	private transpilePrivateRule(atRule: AtRule): Array<Declaration> {
		const styleRule = this.ownerFor(atRule);
		if (!styleRule || this.isSkipped(atRule) || this.processedPrivateRules.has(atRule)) {
			return [];
		}

		this.processedPrivateRules.add(atRule);

		const rulePrivatePropertyNames = this.privatePropertyNamesForRule(styleRule);

		this.hoistPrivatePropertyRegistrations(atRule, rulePrivatePropertyNames);

		if (this.preserve) {
			const clone = atRule.clone();
			this.cleanPrivateRule(clone, rulePrivatePropertyNames);
			clone.walkAtRules(IS_PROPERTY_RULE_REGEX, (propertyRule) => {
				propertyRule.remove();
			});
			removeEmptyNestedGroupRules(clone);

			const hoisted = (clone.nodes || []).map((node) => node.clone());
			if (hoisted.length) {
				atRule.before(hoisted);
			}

			return hoisted.filter((node): node is Declaration => node.type === 'decl');
		}

		this.cleanPrivateRule(atRule, rulePrivatePropertyNames);

		if (!atRule.nodes?.length) {
			this.removePrivateRule(atRule, styleRule);
			return [];
		}

		const hoisted = atRule.nodes.map((node) => node.clone());
		atRule.before(hoisted);
		this.removePrivateRule(atRule, styleRule);

		return hoisted.filter((node): node is Declaration => node.type === 'decl');
	}

	/**
	 * Leave style rules untouched when a registration can not be hoisted without changing layer order.
	 *
	 * A hoisted registration keeps every `@layer` in its chain. Anonymous layers have no name,
	 * so their full layer name can not be reconstructed.
	 */
	private collectSkippedStyleRules(nodes: Array<ChildNode>): void {
		const styleRules: Array<Rule> = [];

		for (const node of nodes) {
			if (node.type === 'rule') {
				styleRules.push(node);
			}

			if (isContainer(node)) {
				node.walkRules((rule) => {
					styleRules.push(rule);
				});
			}
		}

		for (const styleRule of styleRules) {
			if (isInsideMixinOrFunction(styleRule)) {
				this.skipStyleRule(styleRule);
				continue;
			}

			// A mixin that is still present (unsupported or authored for native support)
			// can substitute declarations that reference private properties. Leave the
			// whole subtree untouched so the browser keeps handling it.
			if (!this.allowUntranspiledMixins && hasUntranspiledMixin(styleRule)) {
				this.skipStyleRule(styleRule);
				continue;
			}

			let hasAnonymousLayer = false;

			styleRule.walkAtRules(IS_PRIVATE_RULE_REGEX, (atRule) => {
				if (hasAnonymousLayer) {
					return;
				}

				if (findStyleRule(atRule) !== styleRule) {
					return;
				}

				const collected = collectPropertyRegistrations(atRule, {
					isConditionalGroupRule: () => false,
					shouldDescendInto: canContainPrivateContents,
				});

				for (const { propertyRule } of collected) {
					if (registeredCustomPropertyNames(propertyRule).length && registrationWrappers(propertyRule).hasAnonymousLayer) {
						hasAnonymousLayer = true;
						return;
					}
				}
			});

			if (hasAnonymousLayer) {
				this.skipStyleRule(styleRule);
			}
		}
	}

	private skipStyleRule(styleRule: Rule): void {
		this.skippedStyleRules.add(styleRule);

		for (const ancestor of styleRuleAncestors(styleRule)) {
			this.skippedStyleRules.add(ancestor);
		}
	}

	private ownerFor(node: Node): false | Rule {
		const owner = findStyleRule(node);

		if (!this.scope) {
			return owner;
		}

		if (!owner || !this.scopeRules.has(owner)) {
			return this.scope;
		}

		return owner;
	}

	/**
	 * The style rule chain for a node, using the explicit scope when the node is
	 * outside the subtree that was passed to `transpile`.
	 */
	private styleRuleChain(node: Node): Array<Rule> {
		const rules: Array<Rule> = [];
		let focus: Node = node;
		let usedScope = false;

		while (true) {
			const styleRule = findStyleRule(focus, !this.preserve);
			if (!styleRule) {
				break;
			}

			if (this.scope && !usedScope && !this.scopeRules.has(styleRule)) {
				usedScope = true;
				rules.push(this.scope);
				focus = this.scope;
				continue;
			}

			rules.push(styleRule);
			focus = styleRule;
		}

		return rules;
	}

	private isSkipped(node: Node): boolean {
		for (const styleRule of this.styleRuleChain(node)) {
			if (this.skippedStyleRules.has(styleRule)) {
				return true;
			}
		}

		return false;
	}

	private hoistPrivatePropertyRegistrations(atRule: AtRule, rulePrivatePropertyNames: RulePrivatePropertyNames): void {
		const collected = collectPropertyRegistrations(atRule, {
			isConditionalGroupRule: () => false,
			shouldDescendInto: canContainPrivateContents,
		});

		for (const { propertyRule } of collected) {
			const registration = propertyRule.clone();
			const originalNames = rewriteCustomPropertyNames(registration, (name) => `${rulePrivatePropertyNames.prefix}${name}`);
			if (!originalNames) {
				continue;
			}

			const { wrappers } = registrationWrappers(propertyRule);

			if (!this.preserve) {
				propertyRule.remove();
			}

			for (const name of originalNames) {
				rulePrivatePropertyNames.names.add(name);
			}

			this.propertyRegistrations.push(...wrapInConditionalGroupRules([registration], wrappers));
		}
	}

	private privatePropertyNamesForRule(rule: Rule): RulePrivatePropertyNames {
		const existing = this.privatePropertyNames.get(rule);
		if (existing) {
			return existing;
		}

		const created: RulePrivatePropertyNames = {
			prefix: generateUniqueDashedIdent(this.namespace, hashFileBasenameAndDir(rule.source?.input.from), this.counter.toString(36)),
			names: new Set(),
		};

		this.counter++;
		this.privatePropertyNames.set(rule, created);

		return created;
	}

	private prefixForPropertyName(node: Node, propertyName: string): string | false {
		if (this.isSkipped(node)) {
			return false;
		}

		for (const styleRule of this.styleRuleChain(node)) {
			const rulePrivatePropertyNames = this.privatePropertyNames.get(styleRule);
			if (rulePrivatePropertyNames?.names.has(propertyName)) {
				return rulePrivatePropertyNames.prefix;
			}
		}

		return false;
	}

	private hasPrivatePropertyNames(node: Node): boolean {
		if (this.isSkipped(node)) {
			return false;
		}

		for (const styleRule of this.styleRuleChain(node)) {
			if (this.privatePropertyNames.get(styleRule)?.names.size) {
				return true;
			}
		}

		return false;
	}

	private cleanPrivateRule(atRule: AtRule, rulePrivatePropertyNames: RulePrivatePropertyNames): void {
		this.cleanPrivateRuleNodes(atRule, rulePrivatePropertyNames);
		removeEmptyNestedGroupRules(atRule);
	}

	private cleanPrivateRuleNodes(container: AtRule, rulePrivatePropertyNames: RulePrivatePropertyNames): void {
		const nodes = container.nodes || [];

		for (let i = (nodes.length - 1); i >= 0; i--) {
			const node = nodes[i];

			if (node.type === 'decl') {
				const propertyName = unescapedPropertyName(node.prop);
				if (propertyName === null) {
					node.remove();
					continue;
				}

				rulePrivatePropertyNames.names.add(propertyName);
				node.prop = `${rulePrivatePropertyNames.prefix}${node.prop}`;
				continue;
			}

			if (node.type === 'atrule' && IS_PROPERTY_RULE_REGEX.test(node.name)) {
				continue;
			}

			if (node.type === 'atrule' && IS_NESTED_GROUP_RULE_REGEX.test(node.name) && node.nodes) {
				this.cleanPrivateRuleNodes(node, rulePrivatePropertyNames);
				continue;
			}

			node.remove();
		}
	}

	private removePrivateRule(atRule: AtRule, styleRule: Rule): void {
		let node: Container<ChildNode> | Document | undefined = atRule.parent;
		atRule.remove();

		while (node && node !== styleRule) {
			const parent: Container<ChildNode> | Document | undefined = node.parent;

			if (node.type === 'atrule') {
				const atRuleNode = node as AtRule;

				// Empty layer blocks are kept: they still declare the layer order.
				if (
					IS_NESTED_GROUP_RULE_REGEX.test(atRuleNode.name) &&
					!IS_LAYER_RULE_REGEX.test(atRuleNode.name) &&
					!atRuleNode.nodes?.length
				) {
					atRuleNode.remove();
				}
			}

			node = parent;
		}
	}

	private transpileDeclaration(decl: Declaration): void {
		this.transpileDeclarationPropertyName(decl);

		if (IS_PROPERTY_LIST_REGEX.test(decl.prop)) {
			this.transpilePropertyListValue(decl);
		}

		this.transpileDeclarationValue(decl);
	}

	/**
	 * Rename private property names in `transition` and `transition-property` values.
	 *
	 * A registered private property can be transitioned, and the property name in the value
	 * is a reference to it.
	 */
	private transpilePropertyListValue(decl: Declaration): void {
		if (!decl.value.includes('--')) {
			return;
		}

		if (!this.hasPrivatePropertyNames(decl)) {
			return;
		}

		const componentValues = parseListOfComponentValues(tokenize({ css: decl.value }));
		let changed = false;

		walk(componentValues, (entry) => {
			if (!isTokenNode(entry.node) || !isTokenIdent(entry.node.value)) {
				return;
			}

			const propertyName = entry.node.value[4].value;
			if (!propertyName.startsWith('--')) {
				return;
			}

			const prefix = this.prefixForPropertyName(decl, propertyName);
			if (!prefix) {
				return;
			}

			mutateIdent(entry.node.value, `${prefix}${propertyName}`);
			changed = true;
		});

		if (changed) {
			decl.value = stringify([componentValues]);
		}
	}

	private transpileDeclarationPropertyName(decl: Declaration): void {
		if (!decl.variable) {
			return;
		}

		const propertyName = unescapedPropertyName(decl.prop);
		if (propertyName === null) {
			return;
		}

		const prefix = this.prefixForPropertyName(decl, propertyName);
		if (!prefix) {
			return;
		}

		decl.prop = `${prefix}${decl.prop}`;
	}

	private transpileDeclarationValue(decl: Declaration): void {
		if (!HAS_PRIVATE_REFERENCE_REGEX.test(decl.value)) {
			return;
		}

		if (!this.hasPrivatePropertyNames(decl)) {
			return;
		}

		const componentValues = parseListOfComponentValues(tokenize({ css: decl.value }));
		if (!this.rewritePrivateReferences(componentValues, decl)) {
			return;
		}

		decl.value = stringify([componentValues]);
	}

	private transpileContainerRule(atRule: AtRule): void {
		if (!IS_CONTAINER_RULE_REGEX.test(atRule.name)) {
			return;
		}

		if (!atRule.params.includes('--')) {
			return;
		}

		if (!this.hasPrivatePropertyNames(atRule)) {
			return;
		}

		const componentValues = parseListOfComponentValues(tokenize({ css: atRule.params }));
		if (!this.rewritePrivateReferences(componentValues, atRule)) {
			return;
		}

		atRule.params = stringify([componentValues]);
	}

	private rewritePrivateReferences(componentValues: Array<ComponentValue>, node: Node): boolean {
		let changed = false;

		walk(componentValues, (entry) => {
			if (!isFunctionNode(entry.node)) {
				return;
			}

			const name = entry.node.getName();
			if (IS_STYLE_FUNCTION_REGEX.test(name)) {
				changed = this.rewriteStyleQuery(entry.node.value, node) || changed;
				return;
			}

			if (!IS_VAR_FUNCTION_REGEX.test(name) && !IS_INHERIT_FUNCTION_REGEX.test(name)) {
				return;
			}

			changed = this.rewritePrivatePropertyName(entry.node, node) || changed;
		});

		return changed;
	}

	/**
	 * Rename private property names in a `<style-query>`.
	 *
	 * A style query is a plain feature (`--x: value`), a boolean feature
	 * (`--x`), a range (`10px < --x`) or a condition (`not (...)`,
	 * `(...) and (...)`). Only property-name positions are renamed.
	 */
	private rewriteStyleQuery(componentValues: Array<ComponentValue>, node: Node): boolean {
		let changed = false;
		let colonIndex = -1;
		let comparisonIndex = -1;
		const significant: Array<ComponentValue> = [];

		for (let i = 0; i < componentValues.length; i++) {
			const componentValue = componentValues[i];
			if (isWhiteSpaceOrCommentNode(componentValue)) {
				continue;
			}

			if (isTokenNode(componentValue) && isTokenColon(componentValue.value)) {
				colonIndex = significant.length;
			}

			if (isTokenNode(componentValue) && isTokenDelim(componentValue.value) && isComparisonDelim(componentValue.value[4].value)) {
				comparisonIndex = significant.length;
			}

			significant.push(componentValue);
		}

		if (colonIndex !== -1) {
			// `<style-feature-plain> = <style-feature-name> : <style-feature-value>`
			const name = significant[colonIndex - 1];
			return isTokenNode(name) && isTokenIdent(name.value) && this.renamePrivatePropertyName(name.value, node);
		}

		if (comparisonIndex !== -1) {
			// Every `<custom-property-name>` operand of a range is a property name.
			for (const componentValue of significant) {
				if (!isTokenNode(componentValue) || !isTokenIdent(componentValue.value)) {
					continue;
				}

				changed = this.renamePrivatePropertyName(componentValue.value, node) || changed;
			}

			return changed;
		}

		for (const componentValue of significant) {
			if (isSimpleBlockNode(componentValue)) {
				changed = this.rewriteStyleQuery(componentValue.value, node) || changed;
				continue;
			}

			// `<style-feature-boolean> = <style-feature-name>`
			if (isTokenNode(componentValue) && isTokenIdent(componentValue.value)) {
				changed = this.renamePrivatePropertyName(componentValue.value, node) || changed;
			}
		}

		return changed;
	}

	private renamePrivatePropertyName(token: TokenIdent, node: Node): boolean {
		const propertyName = token[4].value;
		if (!propertyName.startsWith('--')) {
			return false;
		}

		const prefix = this.prefixForPropertyName(node, propertyName);
		if (!prefix) {
			return false;
		}

		mutateIdent(token, `${prefix}${propertyName}`);
		return true;
	}

	private rewritePrivatePropertyName(functionNode: FunctionNode, node: Node): boolean {
		for (const arg of functionNode.value) {
			if (isWhiteSpaceOrCommentNode(arg)) {
				continue;
			}

			if (!isTokenNode(arg) || !isTokenIdent(arg.value)) {
				return false;
			}

			return this.renamePrivatePropertyName(arg.value, node);
		}

		return false;
	}
}

function isComparisonDelim(delim: string): boolean {
	return delim === '<' || delim === '>' || delim === '=';
}

// `@private` contents can only be custom properties, nested group rules and `@property` rules.
function canContainPrivateContents(atRule: AtRule): boolean {
	return !!atRule.nodes && IS_NESTED_GROUP_RULE_REGEX.test(atRule.name);
}

function hasUntranspiledMixin(styleRule: Rule): boolean {
	let found = false;

	styleRule.walkAtRules((atRule) => {
		if (IS_APPLY_RULE_REGEX.test(atRule.name) || IS_CONTENTS_RULE_REGEX.test(atRule.name)) {
			found = true;
		}
	});

	return found;
}

function isInsideMixinOrFunction(node: Node): boolean {
	let parent: Container<ChildNode> | Document | undefined = node.parent;

	while (parent) {
		if (parent.type === 'atrule' && (IS_MIXIN_RULE_REGEX.test((parent as AtRule).name) || IS_FUNCTION_RULE_REGEX.test((parent as AtRule).name))) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}

type RegistrationWrappers = {
	wrappers: Array<AtRule>,
	hasAnonymousLayer: boolean,
};

/**
 * The wrappers a hoisted registration must keep.
 *
 * `@media` and `@supports` are global conditions: the registration must stay conditional.
 * `@layer` is kept to preserve layer precedence between registrations of the same name.
 * `@container`, `@scope` and `@starting-style` do not constrain name-defining at-rules,
 * so they are not kept.
 *
 * Anonymous layers have no name, so a registration inside one can not be hoisted
 * without changing layer identity. Those style rules are left untouched.
 */
function registrationWrappers(node: Node): RegistrationWrappers {
	const wrappers: Array<AtRule> = [];
	let hasAnonymousLayer = false;
	let current: Container<ChildNode> | Document | undefined = node.parent;

	while (current) {
		if (current.type === 'atrule') {
			const atRule = current as AtRule;

			if (IS_LAYER_RULE_REGEX.test(atRule.name)) {
				if (atRule.params.trim()) {
					wrappers.unshift(atRule);
				} else {
					hasAnonymousLayer = true;
				}
			} else if (IS_MEDIA_RULE_REGEX.test(atRule.name) || IS_SUPPORTS_RULE_REGEX.test(atRule.name)) {
				wrappers.unshift(atRule);
			}
		}

		current = current.parent;
	}

	return { wrappers, hasAnonymousLayer };
}

function removeEmptyNestedGroupRules(container: AtRule): void {
	const nodes = container.nodes || [];

	for (let i = (nodes.length - 1); i >= 0; i--) {
		const node = nodes[i];
		if (node.type !== 'atrule' || !IS_NESTED_GROUP_RULE_REGEX.test(node.name)) {
			continue;
		}

		removeEmptyNestedGroupRules(node);

		// Empty layer blocks are kept: they still declare the layer order.
		if (IS_LAYER_RULE_REGEX.test(node.name)) {
			continue;
		}

		if (!node.nodes?.length) {
			node.remove();
		}
	}
}

function unescapedPropertyName(property: string): string | null {
	const token = tokenize({ css: property })[0];
	if (!token || !isTokenIdent(token)) {
		return null;
	}

	const name = token[4].value;

	return name !== '--' && name.startsWith('--') ? name : null;
}

function isContainer(node: ChildNode): node is Rule | AtRule {
	return node.type === 'rule' || node.type === 'atrule';
}

/** Every style rule in `nodes`, including the nodes themselves. */
function collectRules(nodes: Array<ChildNode>): Set<Rule> {
	const rules: Set<Rule> = new Set();

	for (const node of nodes) {
		if (node.type === 'rule') {
			rules.add(node);
		}

		if (isContainer(node)) {
			node.walkRules((rule) => {
				rules.add(rule);
			});
		}
	}

	return rules;
}

function findStyleRule(node: Node, transparentMixins = false): false | Rule {
	if (!node.parent) {
		return false;
	}

	if (node.parent.type === 'rule') {
		const parent = node.parent as Rule;

		if (parent.parent?.type === 'atrule' && IS_KEYFRAMES_RULE_REGEX.test(parent.parent.name)) {
			return false;
		}

		return parent;
	}

	if (node.parent.type === 'atrule') {
		const parent = node.parent as AtRule;

		if (
			IS_NESTED_GROUP_RULE_REGEX.test(parent.name) ||
			(transparentMixins && (IS_APPLY_RULE_REGEX.test(parent.name) || IS_CONTENTS_RULE_REGEX.test(parent.name)))
		) {
			return findStyleRule(parent, transparentMixins);
		}
	}

	return false;
}

function styleRuleAncestors(node: Node): Array<Rule> {
	const styleRules: Array<Rule> = [];
	let focus = node;

	while (true) {
		// Declarations inside an `@apply` or `@contents` block are lexically part
		// of the surrounding style rule. `@private` rules inside those blocks are
		// still handled where they are substituted.
		const styleRule = findStyleRule(focus, true);
		if (!styleRule) {
			break;
		}

		styleRules.push(styleRule);
		focus = styleRule;
	}

	return styleRules;
}
