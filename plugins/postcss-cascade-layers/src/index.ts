import selectorParser from 'postcss-selector-parser';
import { selectorSpecificity } from '@csstools/selector-specificity';
import type { Container, AtRule, PluginCreator, Result } from 'postcss';
import { Model } from './model';
import { adjustSelectorSpecificity } from './adjust-selector-specificity';
import { desugarAndParseLayerNames } from './desugar-and-parse-layer-names';
import { desugarNestedLayers } from './desugar-nested-layers';
import { getLayerAtRuleAncestor } from './get-layer-atrule-ancestor';
import { someAtRuleInTree } from './some-in-tree';
import { sortRootNodes } from './sort-root-nodes';
import { recordLayerOrder } from './record-layer-order';
import { ATRULES_WITH_NON_SELECTOR_BLOCK_LISTS, INVALID_LAYER_NAME } from './constants';
import { splitImportantStyles } from './split-important-styles';
import { pluginOptions } from './options';
import { isProcessableLayerRule } from './is-processable-layer-rule';

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		onRevertLayerKeyword: 'warn',
		onConditionalRulesChangingLayerOrder: 'warn',
		onImportLayerRule: 'warn',
	}, opts);

	return {
		postcssPlugin: 'postcss-cascade-layers',
		OnceExit(root: Container, { result }: { result: Result }) {

			// Warnings
			if (options.onRevertLayerKeyword) {
				root.walkDecls((decl) => {
					if (decl.value.toLowerCase() === 'revert-layer') {
						decl.warn(result, 'handling "revert-layer" is unsupported by this plugin and will cause style differences between browser versions.');
					}
				});
			}

			if (options.onImportLayerRule) {
				root.walkAtRules((atRule) => {
					if (atRule.name.toLowerCase() !== 'import') {
						return;
					}

					if (atRule.params.toLowerCase().includes('layer')) {
						atRule.warn(result, 'To use @import with layers, the postcss-import plugin is also required. This plugin alone will not support using the @import at-rule.');
					}
				},
				);
			}

			splitImportantStyles(root);

			const model = new Model();

			desugarAndParseLayerNames(root, model);

			recordLayerOrder(root, model, { result, options });

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
				if (rule.parent && rule.parent.type === 'atrule' && ATRULES_WITH_NON_SELECTOR_BLOCK_LISTS.includes((rule.parent as AtRule).name.toLowerCase())) {
					return;
				}

				if (getLayerAtRuleAncestor(rule)) {
					return;
				}

				if (rule.some((decl) => decl.type === 'decl' && decl.important)) {
					// !important declarations have inverse priority in layers
					// doing nothing will give the lowest specificity
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
				if (rule.parent && rule.parent.type === 'atrule' && ATRULES_WITH_NON_SELECTOR_BLOCK_LISTS.includes((rule.parent as AtRule).name.toLowerCase())) {
					return;
				}

				const layerForCurrentRule = getLayerAtRuleAncestor(rule);
				if (!layerForCurrentRule) {
					return;
				}

				const fullLayerName = model.getLayerParams(layerForCurrentRule).join('.');

				let specificityAdjustment = model.layerOrder.get(fullLayerName) * highestASpecificity;
				if (rule.some((decl) => decl.type === 'decl' && decl.important)) {
					// !important declarations have inverse priority in layers
					specificityAdjustment = model.layerCount - specificityAdjustment;
				}

				rule.selectors = rule.selectors.map((selector) => {
					return adjustSelectorSpecificity(selector, specificityAdjustment);
				});
			});

			// Remove all @layer at-rules
			// Contained styles are inserted before
			while (someAtRuleInTree(root, (node) => isProcessableLayerRule(node))) {
				root.walkAtRules((atRule) => {
					if (!isProcessableLayerRule(atRule)) {
						return;
					}

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
