import type { Container } from 'postcss';
import type { Model } from './model';
import selectorParser from 'postcss-selector-parser';
import { CONDITIONAL_ATRULES, INVALID_LAYER_NAME } from './constants';
import { someAtRuleInTree, someInTree } from './some-in-tree';
import { getLayerAtRuleAncestor } from './get-layer-atrule-ancestor';
import { removeEmptyAncestorBlocks, removeEmptyDescendantBlocks } from './clean-blocks';
import { isProcessableLayerRule } from './is-processable-layer-rule';

export function desugarAndParseLayerNames(root: Container, model: Model) {
	// - parse layer names
	// - rename anon layers
	// - handle empty layers
	root.walkAtRules((layerRule) => {
		if (!isProcessableLayerRule(layerRule)) {
			return;
		}

		if (layerRule.params) {
			const layerNameList: Array<string> = [];
			let isInvalidLayerName = false;

			// Layer names ("A.B, C") have a similar syntax as selector lists with only class and tag name selectors.
			// - comma separated
			// - "." as a delimiter between idents.
			// We can use "postcss-selector-parser" to analyse layer names so that we don't have to implement our own tokenizer and parser.
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
				layerRule.name = INVALID_LAYER_NAME;
				return;
			}

			// split empty layer at-rules.
			if (!layerRule.nodes || layerRule.nodes.length === 0) {
				if (layerNameList.length <= 1) {
					return;
				}

				layerNameList.slice(0, -1).forEach((name) => {
					model.addLayerParams(name, name);

					layerRule.cloneBefore({
						params: name,
					});
				});

				model.addLayerParams(layerNameList[layerNameList.length - 1], layerNameList[layerNameList.length - 1]);
				layerRule.params = layerNameList[layerNameList.length - 1];

				return;
			}
		}

		// give anonymous layers a name
		if (!layerRule.params) {
			layerRule.raws.afterName = ' ';
			layerRule.params = model.createAnonymousLayerName();
		}

		const hasNestedLayers = someAtRuleInTree(layerRule, (node) => isProcessableLayerRule(node));
		const hasUnlayeredStyles = someInTree(layerRule, (node) => {
			if (node.type !== 'rule') {
				return;
			}

			const closestLayer = getLayerAtRuleAncestor(node);
			return closestLayer === layerRule;
		});

		if (hasNestedLayers && hasUnlayeredStyles) {
			// create new final layer via cloning and keep only the styles
			const implicitLayerName = model.createImplicitLayerName(layerRule.params);
			const implicitLayer = layerRule.clone({
				params: implicitLayerName,
			});

			// only keep unlayered styles for the implicit layer.
			implicitLayer.walkAtRules((node) => {
				if (!isProcessableLayerRule(node)) {
					return;
				}

				node.remove();
			});

			// go through the unlayered rules and delete these from top level atRule
			layerRule.walk((node) => {
				if (node.type === 'atrule' && isProcessableLayerRule(node)) {
					return;
				}

				if (node.type === 'atrule' && CONDITIONAL_ATRULES.includes(node.name.toLowerCase())) {
					return;
				}

				const closestLayer = getLayerAtRuleAncestor(node);
				if (closestLayer === layerRule) {
					node.remove();
				}
			});

			// insert new layer
			layerRule.append(implicitLayer);

			removeEmptyDescendantBlocks(layerRule);
			removeEmptyAncestorBlocks(layerRule);
		}
	});
}
