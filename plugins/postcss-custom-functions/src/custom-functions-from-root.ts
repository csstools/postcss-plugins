import type { ChildNode, Container, Document, Node, Result, Root as PostCSSRoot, AtRule } from 'postcss';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isInConditionalLayer, isProcessableRule } from './is-processable-rule';
import { isProcessableDeclaration } from './is-processable-declaration';
import { classifyCustomFunction } from './classify';
import type { CustomFunction } from '@csstools/custom-function-parser';
import { parse } from '@csstools/custom-function-parser';
import { isTokenFunction, tokenize } from '@csstools/css-tokenizer';

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
};

/**
 * Turn a layer number into a sortable strength.
 * Unlayered definitions (`false`) are stronger than any layer.
 */
function layerStrength(layer: number | false): number {
	return layer === false ? Infinity : layer;
}

const IS_CONDITIONAL_AT_RULE_REGEX = /^(media|supports|container|starting-style)$/i;

// Return custom functions from the css root.
export function getCustomFunctions(root: PostCSSRoot, result: Result): Map<string, CustomFunctionGroup> {
	const groups = new Map<string, CustomFunctionGroup>();

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

		const classification = classifyCustomFunction(atRule, customFunction);

		const name = customFunction.getName();
		// A conditional layer can not be ordered, so a name with a definition in
		// one is unsupported as a whole.
		const supported = classification.supported && !isInConditionalLayer(atRule);

		const definition: CustomFunctionDefinition = {
			node: atRule,
			function: customFunction,
			supported,
			keywordResult: classification.keywordResult,
			hasKeywordResult: classification.hasKeywordResult,
			conditionals: collectConditionalAncestors(atRule),
			layer: cascadeLayerNumberForNode(atRule, cascadeLayersOrder),
			order: order++,
		};

		const group = groups.get(name) ?? { definitions: [], supported: true };
		group.definitions.push(definition);
		group.supported = group.supported && supported;
		groups.set(name, group);
	});

	for (const group of groups.values()) {
		// Definitions are emitted weakest first so the browser cascade picks the
		// strongest active definition at runtime.
		group.definitions.sort((a, b) => {
			return (layerStrength(a.layer) - layerStrength(b.layer)) || (a.order - b.order);
		});

		// A CSS-wide keyword result can only be substituted directly when there is
		// exactly one definition without conditionals that override the result.
		if (group.definitions.some((definition) => definition.hasKeywordResult)) {
			const isPureStaticKeyword = group.definitions.length === 1 && group.definitions[0].keywordResult !== null;
			if (!isPureStaticKeyword) {
				group.supported = false;
			}
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
	collectCustomFunctionReferences(root, supportedNodes, required, true);

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
			collectCustomFunctionReferences(definition.node, new Set(), references, false);

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

function collectCustomFunctionReferences(container: Container, skipNodes: Set<Node>, out: Set<string>, onlyUnprocessable: boolean): void {
	container.walk((node) => {
		if (node.type !== 'decl' || !node.value.includes('--')) {
			return undefined;
		}

		if (isInsideAny(node, skipNodes)) {
			return undefined;
		}

		if (onlyUnprocessable && isProcessableDeclaration(node)) {
			return undefined;
		}

		for (const token of tokenize({ css: node.value })) {
			if (isTokenFunction(token) && token[4].value.startsWith('--')) {
				out.add(token[4].value);
			}
		}

		return undefined;
	});
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

function removeEmptyAncestorBlocks(block: Container | undefined): void {
	if (!block) {
		return;
	}

	let currentNode: Document | Container<ChildNode> | undefined = block;

	while (currentNode) {
		if (currentNode.nodes && currentNode.nodes.length > 0) {
			return;
		}

		const parent: Document | Container<ChildNode> | undefined = currentNode.parent;
		currentNode.remove();
		currentNode = parent;
	}
}
