import type { ChildNode, Container, Document, Node, Result, Root as PostCSSRoot, AtRule } from 'postcss';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isAllowedFunctionPlacement, isProcessableRule } from './is-processable-rule';
import { isProcessableDeclaration } from './is-processable-declaration';
import { classifyCustomFunction, classifyCustomFunctionGroup } from './classify';
import type { CustomFunction } from '@csstools/custom-function-parser';
import { parse } from '@csstools/custom-function-parser';
import { isTokenFunction, isTokenIdent, tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, isTokenNode, parseComponentValue } from '@csstools/css-parser-algorithms';

export type CustomFunctionDefinition = {
	function: CustomFunction;
	node: AtRule;
	supported: boolean;
	/**
	 * The CSS-wide keyword returned by a static `result` descriptor, or `null`.
	 * Only set when the definition has a single, unconditional keyword result.
	 */
	keywordResult: string | null;
	/** Whether any `result` descriptor resolves to a CSS-wide keyword. */
	hasKeywordResult: boolean;
	/** Ancestor conditional group rules, outermost first. Cascade layers are excluded. */
	conditionals: Array<AtRule>;
	/** Cascade layer strength. Higher numbers win, `false` means unlayered (wins over all layers). */
	layer: number | false;
	/** Source order. */
	order: number;
};

export type CustomFunctionGroup = {
	definitions: Array<CustomFunctionDefinition>;
	/** Every definition is supported. Unsupported definitions make the whole name unsupported. */
	supported: boolean;
	/** The static keyword result shared by the group, or `null`. */
	keywordResult: string | null;
};

/**
 * Turn a layer number into a sortable strength.
 * Unlayered definitions (`false`) are stronger than any layer.
 */
function layerStrength(layer: number | false): number {
	return layer === false ? Infinity : layer;
}

const IS_CONDITIONAL_AT_RULE_REGEX = /^(media|supports)$/i;

// Return custom functions from the css root.
export function getCustomFunctions(root: PostCSSRoot, result: Result): Map<string, CustomFunctionGroup> {
	const groups = new Map<string, CustomFunctionGroup>();
	const processed = new Set<AtRule>();

	let cascadeLayersOrder: WeakMap<Node, number> = new WeakMap();
	try {
		cascadeLayersOrder = collectCascadeLayerOrder(root);
	} catch (err) {
		// A stylesheet can have more cascade layers than can be ordered.
		// Warn instead of aborting the whole build and treat every node as unlayered.
		result.warn(`Failed to collect cascade layer order: "${(err instanceof Error) ? err.message : err}"`);
	}

	let order = 0;

	root.walkAtRules((atRule) => {
		if (!isProcessableRule(atRule)) {
			return;
		}

		const source = atRule.params.trim();

		const customFunction = parse(source, {
			onParseError: (err) => {
				atRule.warn(result, `Failed to parse custom function : "${atRule.params}" with message: "${(err instanceof Error) ? err.message : err}"`);
			}
		});
		if (!customFunction) {
			return;
		}

		processed.add(atRule);

		const classification = classifyCustomFunction(atRule, customFunction);

		const name = customFunction.getName();

		const definition: CustomFunctionDefinition = {
			node: atRule,
			function: customFunction,
			supported: classification.supported,
			keywordResult: classification.keywordResult,
			hasKeywordResult: classification.hasKeywordResult,
			conditionals: collectConditionalAncestors(atRule),
			layer: cascadeLayerNumberForNode(atRule, cascadeLayersOrder),
			order: order++,
		};

		// A keyword result can only be substituted at the call site when the
		// definition is always active.
		if (definition.conditionals.length && definition.keywordResult !== null) {
			definition.keywordResult = null;
			definition.hasKeywordResult = true;
		}

		const group = groups.get(name) ?? { definitions: [], supported: true, keywordResult: null };
		group.definitions.push(definition);
		groups.set(name, group);
	});

	// A definition that this plugin does not transpile can still win the cascade.
	// Calls for such a name are left untouched so the browser handles them natively.
	// Invalid definitions (wrong placement, no block) are ignored by browsers and
	// do not affect the name.
	const ignoredNames = new Set<string>();
	root.walkAtRules((atRule) => {
		if (processed.has(atRule) || atRule.name.toLowerCase() !== 'function') {
			return;
		}

		if (!atRule.nodes || !isAllowedFunctionPlacement(atRule)) {
			return;
		}

		const name = functionRuleName(atRule);
		if (!name) {
			return;
		}

		ignoredNames.add(name);
	});

	for (const group of groups.values()) {
		// Definitions are emitted weakest first so the browser cascade picks the
		// strongest active definition at runtime.
		group.definitions.sort((a, b) => {
			return (layerStrength(a.layer) - layerStrength(b.layer)) || (a.order - b.order);
		});

		const classification = classifyCustomFunctionGroup(group.definitions);
		group.supported = classification.supported;
		group.keywordResult = classification.keywordResult;
	}

	for (const [name, group] of groups) {
		if (ignoredNames.has(name)) {
			group.supported = false;
		}
	}

	return groups;
}

/**
 * Remove `@function` rules that are not referenced by any code that will remain
 * in the output.
 *
 * A definition is only removed when every call site is transformed by this
 * plugin. Call sites that are left as-is (for example inside `@keyframes` or a
 * nested conditional declaration) keep their definitions alive.
 */
export function removeUnusedCustomFunctions(root: PostCSSRoot, groups: Map<string, CustomFunctionGroup>): void {
	const supportedNodes = new Set<Node>();
	for (const group of groups.values()) {
		if (!group.supported) {
			continue;
		}

		for (const definition of group.definitions) {
			supportedNodes.add(definition.node);
		}
	}

	// References from code that is not part of a supported definition and that
	// will not be transformed.
	const required = new Set<string>();
	collectCustomFunctionReferences(root, supportedNodes, required, true, groups);

	// Definitions that are kept can reference other definitions.
	const processed = new Set<string>();
	const queue = [...required];
	while (queue.length) {
		const name = queue.pop() as string;
		if (processed.has(name)) {
			continue;
		}

		processed.add(name);

		const group = groups.get(name);
		if (!group || !group.supported) {
			continue;
		}

		for (const definition of group.definitions) {
			const references = new Set<string>();
			collectCustomFunctionReferences(definition.node, new Set(), references, false, groups);

			for (const reference of references) {
				if (required.has(reference)) {
					continue;
				}

				required.add(reference);
				queue.push(reference);
			}
		}
	}

	for (const [name, group] of groups) {
		if (!group.supported || required.has(name)) {
			continue;
		}

		for (const definition of group.definitions) {
			const parent = definition.node.parent;
			definition.node.remove();

			removeEmptyAncestorBlocks(parent);
		}
	}
}

function collectCustomFunctionReferences(container: Container, skipNodes: Set<Node>, out: Set<string>, onlyUnprocessable: boolean, groups: Map<string, CustomFunctionGroup>): void {
	// A definition can reference other functions in its own prelude (parameter defaults).
	if (container.type === 'atrule' && (container as AtRule).params && (container as AtRule).params.includes('--')) {
		collectDashedFunctionNames((container as AtRule).params, out);
	}

	container.walk((node) => {
		if (node.type === 'atrule') {
			// Dashed functions can appear in at-rule preludes and blocks that are
			// expanded later, such as `@apply --mixin(--fn())` and mixin parameter
			// defaults.
			if (skipNodes.has(node) || !node.params || !node.params.includes('--') || isInsideAny(node, skipNodes)) {
				return undefined;
			}

			collectDashedFunctionNames(node.params, out);

			return undefined;
		}

		if (node.type !== 'decl' || !node.value.includes('--')) {
			return undefined;
		}

		if (isInsideAny(node, skipNodes)) {
			return undefined;
		}

		if (onlyUnprocessable && isProcessableDeclaration(node, groups)) {
			return undefined;
		}

		collectDashedFunctionNames(node.value, out);

		return undefined;
	});
}

function collectDashedFunctionNames(value: string, out: Set<string>): void {
	for (const token of tokenize({ css: value })) {
		if (isTokenFunction(token) && token[4].value.startsWith('--')) {
			out.add(token[4].value);
		}
	}
}

function isInsideAny(node: Node, nodes: Set<Node>): boolean {
	let parent = node.parent;
	while (parent) {
		if (nodes.has(parent)) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}

function collectConditionalAncestors(atRule: AtRule): Array<AtRule> {
	const ancestors: Array<AtRule> = [];

	let parent: Container | Document | undefined = atRule.parent;
	while (parent) {
		if (parent.type === 'atrule' && IS_CONDITIONAL_AT_RULE_REGEX.test((parent as AtRule).name)) {
			ancestors.unshift(parent as AtRule);
		}

		parent = parent.parent;
	}

	return ancestors;
}

/**
 * The name of a `@function` rule, even when the rule is not transpilable.
 */
function functionRuleName(atRule: AtRule): string | null {
	if (!atRule.params || !atRule.params.includes('--')) {
		return null;
	}

	const prelude = parseComponentValue(tokenize({ css: atRule.params }));

	let name: string;
	if (isTokenNode(prelude) && isTokenIdent(prelude.value)) {
		name = prelude.value[4].value;
	} else if (isFunctionNode(prelude)) {
		name = prelude.getName();
	} else {
		return null;
	}

	return name.startsWith('--') ? name : null;
}

function removeEmptyAncestorBlocks(block: Container | undefined): void {
	if (!block) {
		return;
	}

	let currentNode: Document | Container<ChildNode> | undefined = block;

	while (currentNode) {
		if (currentNode.nodes && currentNode.nodes.length > 0) {
			return;
		}

		// Empty layer blocks are kept: they still declare the layer order.
		if (currentNode.type === 'atrule' && (currentNode as AtRule).name.toLowerCase() === 'layer') {
			return;
		}

		const parent: Document | Container<ChildNode> | undefined = currentNode.parent;
		currentNode.remove();
		currentNode = parent;
	}
}
