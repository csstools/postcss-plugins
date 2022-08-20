import type { Container, Result } from 'postcss';
import { ANONYMOUS_LAYER_SUFFIX, IMPLICIT_LAYER_SUFFIX } from './constants';
import { getConditionalAtRuleAncestor } from './get-conditional-atrule-ancestor';
import { isProcessableLayerRule } from './is-processable-layer-rule';
import type { Model } from './model';
import { pluginOptions } from './options';

export function recordLayerOrder(root: Container, model: Model, { result, options }: { result: Result, options: pluginOptions }) {
	// record layer order
	root.walkAtRules((layerRule) => {
		if (!isProcessableLayerRule(layerRule)) {
			return;
		}

		const currentLayerNameParts = model.getLayerParams(layerRule);
		const fullLayerName = currentLayerNameParts.join('.');
		if (model.layerOrder.has(fullLayerName)) {
			if (!layerRule.nodes || layerRule.nodes.length === 0) {
				// Remove empty layers
				layerRule.remove();
			}

			return;
		}

		if (
			options.onConditionalRulesChangingLayerOrder &&
			getConditionalAtRuleAncestor(layerRule) &&
			!layerRule.params.endsWith(IMPLICIT_LAYER_SUFFIX) &&
			!layerRule.params.endsWith(ANONYMOUS_LAYER_SUFFIX)
		) {
			layerRule.warn(result, 'handling different layer orders in conditional rules is unsupported by this plugin and will cause style differences between browser versions.');
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

		if (!layerRule.nodes || layerRule.nodes.length === 0) {
			// Remove empty layers
			layerRule.remove();
		}
	});
}
