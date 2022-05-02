import selectorParser from 'postcss-selector-parser';
import selectorSpecificity from '@csstools/selector-specificity';
import type { Container, AtRule, PluginCreator } from 'postcss';
import { Model } from './model';
import { adjustSelectorSpecificity } from './adjust-selector-specificity';
import { desugarAndParseLayerNames } from './desugar-and-parse-layer-names';
import { desugarNestedLayers } from './desugar-nested-layers';
import { getLayerAtRuleAncestor } from './get-layer-atrule-ancestor';
import { someAtRuleInTree } from './some-in-tree';
import { sortRootNodes } from './sort-root-nodes';
import { recordLayerOrder } from './record-layer-order';
import { INVALID_LAYER_NAME } from './constants';

const creator: PluginCreator<undefined> = () => {
	return {
		postcssPlugin: 'postcss-cascade-layers',
		Once(root: Container) {
			const model = new Model();

			desugarAndParseLayerNames(root, model);

			recordLayerOrder(root, model);

			if (!model.layerCount) {
				// Reset "invalid-layer" at rules
				root.walkAtRules(INVALID_LAYER_NAME, (layerRule) => {
					layerRule.name = 'layer';
				});

				// no layers, so nothing to transform.
				return;
			}

			// record selector specificity
			let highestASpecificity = 0;
			root.walkRules((rule) => {
				rule.selectors.forEach((selector) => {
					const specificity = selectorSpecificity(selectorParser().astSync(selector));
					highestASpecificity = Math.max(highestASpecificity, specificity.a + 1);
				});
			});


			// transform unlayered styles - need highest specificity (layerCount)
			root.walkRules((rule) => {
				// Skip any at rules that do not contain regular declarations (@keyframes)
				if (rule.parent && rule.parent.type === 'atrule' && (rule.parent as AtRule).name === 'keyframes') {
					return;
				}

				if (getLayerAtRuleAncestor(rule)) {
					return;
				}

				rule.selectors = rule.selectors.map((selector) => {
					return adjustSelectorSpecificity(selector, model.layerCount * highestASpecificity);
				});
			});

			// Sort layer names
			model.sortLayerNames();

			// Desugar nested layers
			desugarNestedLayers(root, model);

			// Transform order of CSS
			// - split selector rules from  non-selector rules
			// - sort non-selector rules
			sortRootNodes(root, model);

			// transform layered styles:
			//  - give selectors the specificity they need based on layerPriority state
			root.walkRules((rule) => {
				// Skip any at rules that do not contain regular declarations (@keyframes)
				if (rule.parent && rule.parent.type === 'atrule' && (rule.parent as AtRule).name === 'keyframes') {
					return;
				}

				const layerForCurrentRule = getLayerAtRuleAncestor(rule);
				if (!layerForCurrentRule) {
					return;
				}

				const fullLayerName = model.getLayerParams(layerForCurrentRule).join('.');
				rule.selectors = rule.selectors.map((selector) => {
					return adjustSelectorSpecificity(selector, model.layerOrder.get(fullLayerName) * highestASpecificity);
				});
			});

			// Remove all @layer at-rules
			// Contained styles are inserted before
			while (someAtRuleInTree(root, (node) => node.name === 'layer')) {
				root.walkAtRules('layer', (atRule) => {
					atRule.replaceWith(atRule.nodes);
				});
			}

			// Reset "invalid-layer" at rules
			root.walkAtRules(INVALID_LAYER_NAME, (atRule) => {
				atRule.name = 'layer';
			});
		},
	};
};

creator.postcss = true;

export default creator;
