import type { ChildNode, Container, Document, Result, Root as PostCSSRoot, AtRule } from 'postcss';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isProcessableRule } from './is-processable-rule';
import { isComputationallyIndependent } from './is-computationally-independent';
import { staticResultKeyword } from './static-result-keyword';
import type { CustomFunction } from '@csstools/custom-function-parser';
import { parse } from '@csstools/custom-function-parser';

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

// Return custom functions from the css root, conditionally removing them.
export function getCustomFunctions(root: PostCSSRoot, result: Result, opts: { preserve?: boolean }): Map<string, CustomFunctionGroup> {
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
		const supported = isSupportedCustomFunction(customFunction);

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
		// exactly one definition.
		if (group.definitions.length > 1 && group.definitions.some((definition) => staticResultKeyword(definition.node))) {
			group.supported = false;
		}
	}

	if (!opts.preserve) {
		for (const group of groups.values()) {
			if (!group.supported) {
				continue;
			}

			for (const definition of group.definitions) {
				const parent = definition.node.parent;
				definition.node.remove();

				removeEmptyAncestorBlocks(parent);
			}
		}
	}

	return groups;
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
