import type { Container, AtRule, Node, PluginCreator } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { adjustSelectorSpecificity } from './adjust-selector-specificity';
import { desugarNestedLayers } from './desugar-nested-layers';
import { getLayerAtRuleAncestor } from './has-layer-atrule-ancestor';
import { Model } from './model';
import { someInTree } from './some-in-tree';
import { selectorSpecificity } from './specificity';

const creator: PluginCreator<undefined> = () => {
	return {
		postcssPlugin: 'postcss-cascade-layers',
		Once(root: Container) {
			const model = new Model();

			// - parse layer names
			// - rename anon layers
			// - handle empty layers
			root.walkAtRules('layer', (layerRule) => {
				if (layerRule.params) {
					const layerNameList: Array<string> = [];
					let isInvalidLayerName = false;

					selectorParser().astSync(layerRule.params).each((selector) => {
						const currentLayerNameParts: Array<string> = [];

						selector.walk((node) => {
							switch (node.type) {
								case 'class':
									currentLayerNameParts.push(node.value);
									break;
								case 'tag':
									currentLayerNameParts.push(node.value);
									break;
								default:
									isInvalidLayerName = true;
									break;
							}
						});

						if (isInvalidLayerName) {
							return;
						}

						layerNameList.push(currentLayerNameParts.join('.'));

						model.addLayerNameParts(currentLayerNameParts);
					});

					model.addLayerParams(layerRule.params, layerNameList);

					if (layerRule.nodes && layerNameList.length > 1) {
						// If the layer is a container rule it can not have multiple layer names.
						isInvalidLayerName = true;
					}

					if (isInvalidLayerName) {
						// Set invalid layers to "invalid-layer"
						// We reset these later.
						layerRule.name = 'invalid-layer';
						return;
					}

					// handle empty layer at-rules.
					if (!layerRule.nodes || layerRule.nodes.length === 0) {
						layerNameList.forEach((name) => {
							model.getLayerNameList(name).forEach((part) => {
								if (model.layerOrder.has(part)) {
									return;
								}

								model.layerOrder.set(part, model.layerCount);
								model.layerCount += 1;
							});
						});

						layerRule.remove();
						return;
					}
				}

				// give anonymous layers a name
				if (!layerRule.params) {
					layerRule.raws.afterName = ' ';
					layerRule.params = model.createAnonymousLayerName();
				}

				let hasNestedLayers = false;
				let hasUnlayeredStyles = false;

				// check for where a layer has nested layers AND styles outside of those layers
				layerRule.each((node) => {
					if (node.type === 'atrule' && node.name === 'layer') {
						hasNestedLayers = true;
					} else {
						hasUnlayeredStyles = true;
					}

					if (hasNestedLayers && hasUnlayeredStyles) {
						return false;
					}
				});

				if (hasNestedLayers && hasUnlayeredStyles) {
					// create new final layer via cloning and keep only the styles
					const implicitLayerName = model.createImplicitLayerName(layerRule.params);
					const implicitLayer = layerRule.clone({
						params: implicitLayerName,
					});

					implicitLayer.each((node) => {
						if (node.type === 'atrule' && node.name === 'layer') {
							node.remove();
						}
					});

					// insert new layer
					layerRule.append(implicitLayer);

					// go through the unlayered rules and delete from top level atRule
					layerRule.each((node) => {
						if (node.type === 'atrule' && node.name === 'layer') {
							return;
						}

						node.remove();
					});
				}
			});

			// record layer order
			root.walkAtRules('layer', (layerRule) => {
				const currentLayerNameParts = model.getLayerParams(layerRule);
				const fullLayerName = currentLayerNameParts.join('.');
				if (model.layerOrder.has(fullLayerName)) {
					return;
				}

				if (!model.layerParamsParsed.has(fullLayerName)) {
					model.layerParamsParsed.set(fullLayerName, [fullLayerName]);
				}

				if (!model.layerNameParts.has(fullLayerName)) {
					model.layerNameParts.set(fullLayerName, [...currentLayerNameParts]);
				}

				model.getLayerNameList(fullLayerName).forEach((name) => {
					if (model.layerOrder.has(name)) {
						return;
					}

					model.layerOrder.set(name, model.layerCount);
					model.layerCount += 1;
				});
			});

			if (!model.layerCount) {
				// Reset "invalid-layer" at rules
				root.walkAtRules('invalid-layer', (layerRule) => {
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
				if (getLayerAtRuleAncestor(rule)) {
					return;
				}

				// Skip any at rules that do not contain regular declarations (@keyframes)
				if (rule.parent && rule.parent.type === 'atrule' && (rule.parent as AtRule).name === 'keyframes') {
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
			{
				// Separate selector rules from other rules
				root.walkAtRules('layer', (layerRule) => {
					const withSelectorRules = layerRule.clone();
					const withoutSelectorRules = layerRule.clone();

					withSelectorRules.walkAtRules((atRule) => {
						if (atRule.name === 'keyframes') {
							const parent = atRule.parent;
							atRule.remove();
							if (parent.nodes.length === 0) {
								parent.remove();
							}

							return;
						}

						if (someInTree(atRule, (node) => {
							return node.type === 'rule';
						})) {
							return;
						}

						const parent = atRule.parent;
						atRule.remove();
						if (parent.nodes.length === 0) {
							parent.remove();
						}
					});

					withoutSelectorRules.walkRules((rule) => {
						if (rule.parent && rule.parent.type === 'atrule' && (rule.parent as AtRule).name === 'keyframes') {
							return;
						}

						const parent = rule.parent;
						rule.remove();
						if (parent.nodes.length === 0) {
							parent.remove();
						}
					});

					withSelectorRules.name = 'layer-with-selector-rules';

					layerRule.replaceWith(withSelectorRules, withoutSelectorRules);
					if (withSelectorRules.nodes.length === 0) {
						withSelectorRules.remove();
					}

					if (withoutSelectorRules.nodes.length === 0) {
						withoutSelectorRules.remove();
					}
				});

				// Sort layer nodes
				model.sortRootNodes(root.nodes);

				// Reset "layer-with-selector-rules" at rules
				root.walkAtRules('layer-with-selector-rules', (atRule) => {
					atRule.name = 'layer';
				});
			}

			// transform layered styles:
			//  - give selectors the specificity they need based on layerPriority state
			root.walkRules((rule) => {
				const layerForCurrentRule = getLayerAtRuleAncestor(rule);
				if (!layerForCurrentRule) {
					return;
				}

				// Skip any at rules that do not contain regular declarations (@keyframes)
				if (rule.parent && rule.parent.type === 'atrule' && (rule.parent as AtRule).name === 'keyframes') {
					return;
				}

				const fullLayerName = model.getLayerParams(layerForCurrentRule).join('.');
				rule.selectors = rule.selectors.map((selector) => {
					return adjustSelectorSpecificity(selector, model.layerOrder.get(fullLayerName) * highestASpecificity);
				});
			});

			// Remove all @layer at-rules
			// Contained styles are inserted before
			while (someInTree(root, (node) => node.type === 'atrule' && node.name === 'layer')) {
				root.walkAtRules('layer', (atRule) => {
					atRule.replaceWith(atRule.nodes);
				});
			}

			// Reset "invalid-layer" at rules
			root.walkAtRules('invalid-layer', (atRule) => {
				atRule.name = 'layer';
			});
		},
	};
};

creator.postcss = true;

export default creator;
