import type { ChildNode, Container, Document, Node, Result, Root as PostCSSRoot, AtRule } from 'postcss';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isInConditionalLayer, isProcessableRule } from './is-processable-rule';
import { isProcessableDeclaration } from './is-processable-declaration';
import { isComputationallyIndependent } from './is-computationally-independent';
import { staticResultKeyword } from './static-result-keyword';
import type { CustomFunction } from '@csstools/custom-function-parser';
import { parse } from '@csstools/custom-function-parser';
import { isTokenFunction, isTokenIdent, tokenize } from '@csstools/css-tokenizer';

export type CustomFunctionDefinition = {
	function: CustomFunction;
	node: AtRule;
	supported: boolean;
	/** Ancestor conditional group rules, outermost first. Cascade layers are excluded. */
	conditionals: Array<AtRule>;
	/** Cascade layer strength. Higher numbers win. */
	layer: number;
	/** Source order. */
	order: number;
};

export type CustomFunctionGroup = {
	definitions: Array<CustomFunctionDefinition>;
	/** Every definition is supported. Unsupported definitions make the whole name unsupported. */
	supported: boolean;
};

const CSS_WIDE_KEYWORDS = new Set(['initial', 'inherit', 'unset', 'revert', 'revert-layer', 'revert-rule']);

const IS_CONDITIONAL_AT_RULE_REGEX = /^(media|supports|container|starting-style)$/i;

/**
 * A function is supported when it has no return type and every parameter is
 * either untyped (with or without a default) or typed with a computationally
 * independent default value.
 *
 * Typed parameters without defaults are not supported yet.
 */
function isSupportedCustomFunction(customFunction: CustomFunction): boolean {
	if (customFunction.getReturnType()) {
		return false;
	}

	return customFunction.parameters.every((parameter) => {
		const type = parameter.getArgumentType();
		const typed = !!type && type !== '*';

		if (typed) {
			// A typed default becomes the `initial-value` of the generated
			// `@property` registration and must be computationally independent.
			return !!parameter.getDefaultValue() && isComputationallyIndependent(parameter.getDefaultValue());
		}

		// Untyped parameters, with or without a default, are supported.
		return true;
	});
}

/**
 * A `result` descriptor that resolves to a CSS-wide keyword can not be
 * substituted through a custom property. When it is the only descriptor of a
 * single definition it is handled directly, otherwise the function is
 * unsupported and left as-is.
 */
function hasKeywordResult(atRule: AtRule): boolean {
	let found = false;

	atRule.walkDecls((decl) => {
		if (decl.prop.toLowerCase() !== 'result') {
			return;
		}

		for (const token of tokenize({ css: decl.value })) {
			if (isTokenIdent(token) && CSS_WIDE_KEYWORDS.has(token[4].value.toLowerCase())) {
				found = true;
			}
		}
	});

	return found;
}

// Return custom functions from the css root.
export function getCustomFunctions(root: PostCSSRoot, result: Result): Map<string, CustomFunctionGroup> {
	const groups = new Map<string, CustomFunctionGroup>();
	const cascadeLayersOrder = collectCascadeLayerOrder(root);

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

		const name = customFunction.getName();
		// A conditional layer can not be ordered, so a name with a definition in
		// one is unsupported as a whole.
		const supported = isSupportedCustomFunction(customFunction) && !isInConditionalLayer(atRule);

		const definition: CustomFunctionDefinition = {
			node: atRule,
			function: customFunction,
			supported,
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
			return (a.layer - b.layer) || (a.order - b.order);
		});

		// A CSS-wide keyword result can only be substituted directly when there is
		// exactly one definition without conditionals that override the result.
		if (group.definitions.some((definition) => hasKeywordResult(definition.node))) {
			const isPureStaticKeyword = group.definitions.length === 1 && staticResultKeyword(group.definitions[0].node) !== null;
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
