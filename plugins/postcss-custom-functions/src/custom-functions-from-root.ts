import type { ChildNode, Container, Document, Result, Root as PostCSSRoot, AtRule } from 'postcss';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isProcessableRule } from './is-processable-rule';
import type { CustomFunction} from '@csstools/custom-function-parser';
import { parse } from '@csstools/custom-function-parser';

export type CustomFunctionAndNode = {
	function: CustomFunction;
	node: AtRule;
}

// return custom functions from the css root, conditionally removing them
export function getCustomFunctions(root: PostCSSRoot, result: Result, opts: { preserve?: boolean }): Map<string, CustomFunctionAndNode> {
	// initialize custom selectors
	const customFunctions = new Map<string, CustomFunctionAndNode>();
	const customFunctionsCascadeLayerMapping: Map<string, number> = new Map();

	const cascadeLayersOrder = collectCascadeLayerOrder(root);

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

		const thisCascadeLayer = cascadeLayerNumberForNode(atRule, cascadeLayersOrder);
		const existingCascadeLayer = customFunctionsCascadeLayerMapping.get(name) ?? -1;

		if (thisCascadeLayer && thisCascadeLayer >= existingCascadeLayer) {
			customFunctionsCascadeLayerMapping.set(name, thisCascadeLayer);
			// re-parsing is important to obtain the correct AST shape
			customFunctions.set(name, {
				node: atRule,
				function: customFunction,
			});
		}

		if (!opts.preserve) {
			const parent = atRule.parent;
			atRule.remove();

			removeEmptyAncestorBlocks(parent);
		}
	});

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
