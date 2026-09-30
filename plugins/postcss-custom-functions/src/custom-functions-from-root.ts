import type { ChildNode, Container, Document, Result, Root as PostCSSRoot, AtRule } from 'postcss';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isProcessableRule } from './is-processable-rule';
import type { CustomFunction } from '@csstools/custom-function-parser';
import { parse } from '@csstools/custom-function-parser';

export type CustomFunctionAndNode = {
	function: CustomFunction;
	node: AtRule;
	supported: boolean;
};

/**
 * A function is supported by this first iteration when it has no typed
 * parameters, no default values and no return type.
 */
function isSupportedCustomFunction(customFunction: CustomFunction): boolean {
	if (customFunction.getReturnType()) {
		return false;
	}

	return customFunction.parameters.every((parameter) => {
		return !parameter.getArgumentType() && !parameter.getDefaultValue();
	});
}

// Return custom functions from the css root, conditionally removing them.
export function getCustomFunctions(root: PostCSSRoot, result: Result, opts: { preserve?: boolean }): Map<string, CustomFunctionAndNode> {
	const customFunctions = new Map<string, CustomFunctionAndNode>();
	const customFunctionsCascadeLayerMapping: Map<string, number> = new Map();

	const cascadeLayersOrder = collectCascadeLayerOrder(root);

	const removable: Array<AtRule> = [];

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

		const thisCascadeLayer = cascadeLayerNumberForNode(atRule, cascadeLayersOrder);
		const existingCascadeLayer = customFunctionsCascadeLayerMapping.get(name) ?? -1;

		if (thisCascadeLayer >= existingCascadeLayer) {
			customFunctionsCascadeLayerMapping.set(name, thisCascadeLayer);
			customFunctions.set(name, {
				node: atRule,
				function: customFunction,
				supported,
			});
		}

		if (supported) {
			removable.push(atRule);
		}
	});

	if (!opts.preserve) {
		for (const atRule of removable) {
			const parent = atRule.parent;
			atRule.remove();

			removeEmptyAncestorBlocks(parent);
		}
	}

	return customFunctions;
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
