import type { Container, AtRule, ChildNode } from 'postcss';
import { removeEmptyAncestorBlocks, removeEmptyDescendantBlocks } from './clean-blocks';
import { isProcessableLayerRule } from './is-processable-layer-rule';
import type { Model } from './model';
import { someAtRuleInTree } from './some-in-tree';

export function desugarNestedLayers(root: Container<ChildNode>, model: Model) {
	while (someAtRuleInTree(root, (node) => {
		return node.nodes && someAtRuleInTree(node, (nested) => {
			return isProcessableLayerRule(nested);
		});
	})) {
		let foundUnexpectedLayerNesting = false;

		root.walkAtRules((layerRule) => {
			if (!isProcessableLayerRule(layerRule)) {
				return;
			}

			if (layerRule.parent === root) {
				return;
			}

			if (layerRule.parent.type === 'atrule' && isProcessableLayerRule(layerRule.parent as AtRule)) {
				const parent = layerRule.parent as AtRule;

				// Concatenate the current layer params with those of the parent. Store the result in the data model.
				model.layerNameParts.set(`${parent.params}.${layerRule.params}`, [...model.layerNameParts.get(parent.params), ...model.layerNameParts.get(layerRule.params)]);
				model.layerParamsParsed.set(`${parent.params}.${layerRule.params}`, [`${parent.params}.${layerRule.params}`]);

				layerRule.params = `${parent.params}.${layerRule.params}`;

				parent.before(layerRule);
				removeEmptyDescendantBlocks(parent);
				removeEmptyAncestorBlocks(parent);

				return;
			}

			if (layerRule.parent.type === 'atrule') {
				const parent = layerRule.parent as AtRule;
				const parentClone = parent.clone();
				const layerRuleClone = layerRule.clone();

				parentClone.removeAll();

				layerRuleClone.removeAll();
				parentClone.append(layerRule.nodes);

				layerRuleClone.append(parentClone);
				parent.before(layerRuleClone);

				layerRule.remove();
				removeEmptyDescendantBlocks(parent);
				removeEmptyAncestorBlocks(parent);
				return;
			}

			foundUnexpectedLayerNesting = true;
		});

		if (foundUnexpectedLayerNesting) {
			break;
		}
	}
}
