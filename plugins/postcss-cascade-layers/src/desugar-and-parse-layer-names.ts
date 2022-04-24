import type { Container } from 'postcss';
import type { Model } from './model';
import selectorParser from 'postcss-selector-parser';
import { INVALID_LAYER_NAME } from './constants';

export function desugarAndParseLayerNames(root: Container, model: Model) {
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
				layerRule.name = INVALID_LAYER_NAME;
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
}
