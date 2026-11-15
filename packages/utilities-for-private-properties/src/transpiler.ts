import type { AtRule, ChildNode, Container, Declaration, Document, Node, Rule } from 'postcss';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues, stringify, walk } from '@csstools/css-parser-algorithms';
import { generateUniqueDashedIdent, hashFileBasenameAndDir } from '@csstools/generate-idents';
import { collectPropertyRegistrations, hoistPropertyRegistrations } from '@csstools/utilities-for-property-registrations';

const HAS_PRIVATE_REFERENCE_REGEX = /\b(var|if|style|inherit)\(/i;
const IS_CONTAINER_RULE_REGEX = /^container$/i;
const IS_INHERIT_FUNCTION_REGEX = /^inherit$/i;
const IS_KEYFRAMES_RULE_REGEX = /^keyframes$/i;
const IS_LAYER_RULE_REGEX = /^layer$/i;
const IS_MEDIA_RULE_REGEX = /^media$/i;
const IS_NESTED_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;
const IS_PRIVATE_RULE_REGEX = /^private$/i;
const IS_PROPERTY_RULE_REGEX = /^property$/i;
const IS_STYLE_FUNCTION_REGEX = /^style$/i;
const IS_SUPPORTS_RULE_REGEX = /^supports$/i;
const IS_VAR_FUNCTION_REGEX = /^var$/i;

type RulePrivatePropertyNames = {
	prefix: string,
	names: Set<string>,
};

export class Transpiler {
	private privatePropertyNames: WeakMap<Rule, RulePrivatePropertyNames> = new WeakMap();

	private counter = 0;

	private namespace: string;

	private propertyRegistrations: Array<AtRule> = [];

	constructor(namespace = 'p') {
		this.namespace = namespace;
	}

	transpile(nodes: Array<ChildNode>): Array<AtRule> {
		for (const node of nodes) {
			if (node.type === 'atrule' && IS_PRIVATE_RULE_REGEX.test(node.name)) {
				this.transpilePrivateRule(node);
			}

			if (isContainer(node)) {
				node.walkAtRules(IS_PRIVATE_RULE_REGEX, (atRule) => this.transpilePrivateRule(atRule));
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
	}

	private transpilePrivateRule(atRule: AtRule): void {
		const styleRule = findStyleRule(atRule);
		if (!styleRule) {
			return;
		}

		const rulePrivatePropertyNames = this.privatePropertyNamesForRule(styleRule);
		const nestedGroupRules = nestedGroupRulesBetween(atRule, styleRule);

		if (nestedGroupRules.every(canWrapRegistration)) {
			this.hoistPrivatePropertyRegistrations(atRule, rulePrivatePropertyNames, nestedGroupRules);
		}

		this.cleanPrivateRule(atRule, rulePrivatePropertyNames);

		if (!atRule.nodes?.length) {
			this.removePrivateRule(atRule, styleRule);
			return;
		}

		atRule.before(atRule.nodes.map((node) => node.clone()));
		this.removePrivateRule(atRule, styleRule);
	}

	private hoistPrivatePropertyRegistrations(atRule: AtRule, rulePrivatePropertyNames: RulePrivatePropertyNames, nestedGroupRules: Array<AtRule>): void {
		const collected = collectPropertyRegistrations(atRule, {
			isConditionalGroupRule: canWrapRegistration,
			shouldDescendInto: canWrapRegistration,
		});

		const { registrations, originalNames } = hoistPropertyRegistrations(collected, {
			rewriteCustomPropertyName: (name) => `${rulePrivatePropertyNames.prefix}${name}`,
			conditionalGroupRules: nestedGroupRules,
			removeOriginal: true,
		});

		for (const name of originalNames) {
			rulePrivatePropertyNames.names.add(name);
		}

		this.propertyRegistrations.push(...registrations);
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
		for (const styleRule of styleRuleAncestors(node)) {
			const rulePrivatePropertyNames = this.privatePropertyNames.get(styleRule);
			if (rulePrivatePropertyNames?.names.has(propertyName)) {
				return rulePrivatePropertyNames.prefix;
			}
		}

		return false;
	}

	private hasPrivatePropertyNames(node: Node): boolean {
		for (const styleRule of styleRuleAncestors(node)) {
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
		this.transpileDeclarationValue(decl);
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
			if (!IS_VAR_FUNCTION_REGEX.test(name) && !IS_STYLE_FUNCTION_REGEX.test(name) && !IS_INHERIT_FUNCTION_REGEX.test(name)) {
				return;
			}

			changed = this.rewritePrivatePropertyName(entry.node, node) || changed;
		});

		return changed;
	}

	private rewritePrivatePropertyName(functionNode: FunctionNode, node: Node): boolean {
		for (const arg of functionNode.value) {
			if (isWhiteSpaceOrCommentNode(arg)) {
				continue;
			}

			if (!isTokenNode(arg) || !isTokenIdent(arg.value)) {
				return false;
			}

			const propertyName = arg.value[4].value;
			if (!propertyName.startsWith('--')) {
				return false;
			}

			const prefix = this.prefixForPropertyName(node, propertyName);
			if (!prefix) {
				return false;
			}

			mutateIdent(arg.value, `${prefix}${propertyName}`);
			return true;
		}

		return false;
	}
}

function canWrapRegistration(atRule: AtRule): boolean {
	return IS_LAYER_RULE_REGEX.test(atRule.name) || IS_MEDIA_RULE_REGEX.test(atRule.name) || IS_SUPPORTS_RULE_REGEX.test(atRule.name);
}

function nestedGroupRulesBetween(atRule: AtRule, styleRule: Rule): Array<AtRule> {
	const nestedGroupRules: Array<AtRule> = [];
	let node: Container<ChildNode> | Document | undefined = atRule.parent;

	while (node && node !== styleRule) {
		if (node.type === 'atrule') {
			nestedGroupRules.push(node as AtRule);
		}

		node = node.parent;
	}

	return nestedGroupRules.reverse();
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

function findStyleRule(node: Node): false | Rule {
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

		if (IS_NESTED_GROUP_RULE_REGEX.test(parent.name)) {
			return findStyleRule(parent);
		}
	}

	return false;
}

function styleRuleAncestors(node: Node): Array<Rule> {
	const styleRules: Array<Rule> = [];
	let focus = node;

	while (true) {
		const styleRule = findStyleRule(focus);
		if (!styleRule) {
			break;
		}

		styleRules.push(styleRule);
		focus = styleRule;
	}

	return styleRules;
}
