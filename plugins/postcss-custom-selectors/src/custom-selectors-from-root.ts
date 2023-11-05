import type { ChildNode, Container, Document, Result, Root as PostCSSRoot } from 'postcss';
import type { Root as SelectorRoot } from 'postcss-selector-parser';
import parser from 'postcss-selector-parser';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isProcessableCustomSelectorRule } from './is-processable-custom-selector-rule';

// return custom selectors from the css root, conditionally removing them
export default function getCustomSelectors(root: PostCSSRoot, result: Result, opts: { preserve?: boolean }): Map<string, SelectorRoot> {
	// initialize custom selectors
	const customSelectors = new Map<string, SelectorRoot>();
	const customSelectorsCascadeLayerMapping: Map<string, number> = new Map();

	const cascadeLayersOrder = collectCascadeLayerOrder(root);

	root.walkAtRules((atRule) => {
		if (!isProcessableCustomSelectorRule(atRule)) {
			return;
		}

		try {
			const source = atRule.params.trim();

			const selectorAST = parser().astSync(source);
			const nameNode = selectorAST?.nodes?.[0]?.nodes?.[0];
			if (!nameNode || nameNode.type !== 'pseudo' || !nameNode.value.startsWith(':--')) {
				return;
			}

			const name = nameNode.toString();

			const thisCascadeLayer = cascadeLayerNumberForNode(atRule, cascadeLayersOrder);
			const existingCascadeLayer = customSelectorsCascadeLayerMapping.get(name) ?? -1;

			if (thisCascadeLayer && thisCascadeLayer >= existingCascadeLayer) {
				customSelectorsCascadeLayerMapping.set(name, thisCascadeLayer);
				// re-parsing is important to obtain the correct AST shape
				customSelectors.set(name, parser().astSync(source.slice(name.length).trim()));
			}

			if (!opts.preserve) {
				const parent = atRule.parent;
				atRule.remove();

				removeEmptyAncestorBlocks(parent);
			}
		} catch (err) {
			atRule.warn(result, `Failed to parse custom selector : "${atRule.params}" with message: "${err.message}"`);
		}
	});

	return customSelectors;
}

function removeEmptyAncestorBlocks(block: Container | undefined) {
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
