import type { AtRule, Container } from 'postcss';
import type { Model } from './model';
import { ATRULES_WITH_NON_SELECTOR_BLOCK_LISTS, CONDITIONAL_ATRULES, IS_LAYER_REGEX, WITH_SELECTORS_LAYER_NAME } from './constants';
import { someInTree } from './some-in-tree';
import { removeEmptyAncestorBlocks, removeEmptyDescendantBlocks } from './clean-blocks';
import { isProcessableLayerRule } from './is-processable-layer-rule';

// Sort root nodes to apply the preferred order by layer priority for non-selector rules.
// Selector rules are adjusted by specificity.
export function sortRootNodes(root: Container, model: Model) {
	if (!root.nodes) {
		return;
	}

	// Separate selector rules from other rules
	root.walkAtRules((layerRule) => {
		if (!isProcessableLayerRule(layerRule)) {
			return;
		}

		const withSelectorRules = layerRule.clone();
		const withoutSelectorRules = layerRule.clone();

		withSelectorRules.walkAtRules((atRule) => {
			if (ATRULES_WITH_NON_SELECTOR_BLOCK_LISTS.includes(atRule.name.toLowerCase())) {
				const parent = atRule.parent;
				atRule.remove();
				removeEmptyDescendantBlocks(parent);
				removeEmptyAncestorBlocks(parent);

				return;
			}

			if (someInTree(atRule, (node) => {
				return node.type === 'rule';
			})) {
				return;
			}

			const parent = atRule.parent;
			atRule.remove();
			removeEmptyDescendantBlocks(parent);
			removeEmptyAncestorBlocks(parent);
		});

		withoutSelectorRules.walkRules((rule) => {
			if (rule.parent && rule.parent.type === 'atrule' && ATRULES_WITH_NON_SELECTOR_BLOCK_LISTS.includes((rule.parent as AtRule).name.toLowerCase())) {
				return;
			}

			const parent = rule.parent;
			rule.remove();
			removeEmptyDescendantBlocks(parent);
			removeEmptyAncestorBlocks(parent);
		});

		withoutSelectorRules.walkAtRules((atRule) => {
			if (CONDITIONAL_ATRULES.includes(atRule.name.toLowerCase())) {
				removeEmptyDescendantBlocks(atRule);
				removeEmptyAncestorBlocks(atRule);
				return;
			}
		});

		withSelectorRules.name = WITH_SELECTORS_LAYER_NAME;

		layerRule.replaceWith(withSelectorRules, withoutSelectorRules);
		if (!withSelectorRules.nodes?.length) {
			withSelectorRules.remove();
		}

		if (!withoutSelectorRules.nodes?.length) {
			withoutSelectorRules.remove();
		}
	});

	root.nodes.sort((a, b) => {
		const aIsLayer = a.type === 'atrule' && IS_LAYER_REGEX.test(a.name);
		const bIsLayer = b.type === 'atrule' && IS_LAYER_REGEX.test(b.name);
		if (aIsLayer && bIsLayer) {
			const layerOrderA = model.layerOrder.get(a.params) ?? 0;
			const layerOrderB = model.layerOrder.get(b.params) ?? 0;
			return layerOrderA - layerOrderB;
		} else if (aIsLayer !== bIsLayer) {
			return aIsLayer ? -1 : 1;
		}

		return 0;
	});

	// Reset "layer-with-selector-rules" at rules
	root.walkAtRules(WITH_SELECTORS_LAYER_NAME, (atRule) => {
		atRule.name = 'layer';
	});
}
