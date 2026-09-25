import type { Container, AtRule, ChildNode } from 'postcss';
import { removeEmptyAncestorBlocks, removeEmptyDescendantBlocks } from './clean-blocks';
import { isProcessableLayerRule } from './is-processable-layer-rule';
import type { Model } from './model';

// Nested layers are flattened one level per pass.
// Bound the depth so that deeply nested input can not cause super-linear work.
const MAX_NESTED_LAYER_DEPTH = 512;

export function desugarNestedLayers(root: Container<ChildNode>, model: Model): void {
	let depth = 0;
	while (hasNestedProcessableLayerRule(root)) {
		depth++;
		if (depth > MAX_NESTED_LAYER_DEPTH) {
			throw new Error('Maximum nested @layer depth exceeded, reduce the complexity of your layers');
		}

		let foundUnexpectedLayerNesting = false;

		root.walkAtRules((layerRule) => {
			if (!isProcessableLayerRule(layerRule)) {
				return;
			}

			if (layerRule.parent === root) {
				return;
			}

			if (layerRule.parent?.type === 'atrule' && isProcessableLayerRule(layerRule.parent)) {
				const parent = layerRule.parent as AtRule;

				{
					// Concatenate the current layer params with those of the parent. Store the result in the data model.
					const parentParamsLayerNameParts = model.layerNameParts.get(parent.params);
					const currentParamsLayerNameParts = model.layerNameParts.get(layerRule.params);
					if (!parentParamsLayerNameParts || !currentParamsLayerNameParts) {
						return;
					}

					model.layerNameParts.set(`${parent.params}.${layerRule.params}`, [...parentParamsLayerNameParts, ...currentParamsLayerNameParts]);
					model.layerParamsParsed.set(`${parent.params}.${layerRule.params}`, [`${parent.params}.${layerRule.params}`]);
				}

				layerRule.params = `${parent.params}.${layerRule.params}`;

				parent.before(layerRule);
				removeEmptyDescendantBlocks(parent);
				removeEmptyAncestorBlocks(parent);

				return;
			}

			if (layerRule.parent?.type === 'atrule') {
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

// Whether any processable layer rule is nested inside another at-rule.
// This is computed in a single walk instead of recursively walking every subtree.
function hasNestedProcessableLayerRule(root: Container<ChildNode>): boolean {
	let found = false;

	root.walkAtRules((node) => {
		if (!isProcessableLayerRule(node)) {
			return;
		}

		const parent = node.parent;
		if (parent && parent !== root && parent.type === 'atrule') {
			found = true;
			return false;
		}
	});

	return found;
}
