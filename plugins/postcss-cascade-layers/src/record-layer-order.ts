import type { Container } from 'postcss';
import type { Model } from './model';

export function recordLayerOrder(root: Container, model: Model) {
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
}
