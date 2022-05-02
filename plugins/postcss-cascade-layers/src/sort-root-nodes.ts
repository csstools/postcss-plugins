import type { AtRule, Container } from 'postcss';
import type { Model } from './model';
import { WITH_SELECTORS_LAYER_NAME } from './constants';
import { someInTree } from './some-in-tree';

// Sort root nodes to apply the preferred order by layer priority for non-selector rules.
// Selector rules are adjusted by specificity.
export function sortRootNodes(root: Container, model: Model) {
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

		withSelectorRules.name = WITH_SELECTORS_LAYER_NAME;

		layerRule.replaceWith(withSelectorRules, withoutSelectorRules);
		if (withSelectorRules.nodes.length === 0) {
			withSelectorRules.remove();
		}

		if (withoutSelectorRules.nodes.length === 0) {
			withoutSelectorRules.remove();
		}
	});

	root.nodes.sort((a, b) => {
		const aIsCharset = a.type === 'atrule' && a.name === 'charset';
		const bIsCharset = b.type === 'atrule' && b.name === 'charset';
		if (aIsCharset && bIsCharset) {
			return 0;
		} else if (aIsCharset !== bIsCharset) {
			return aIsCharset ? -1 : 1;
		}

		const aIsImport = a.type === 'atrule' && a.name === 'import';
		const bIsImport = b.type === 'atrule' && b.name === 'import';
		if (aIsImport && bIsImport) {
			return 0;
		} else if (aIsImport !== bIsImport) {
			return aIsImport ? -1 : 1;
		}

		const aIsLayer = a.type === 'atrule' && a.name === 'layer';
		const bIsLayer = b.type === 'atrule' && b.name === 'layer';
		if (aIsLayer && bIsLayer) {
			return model.layerOrder.get(a.params) - model.layerOrder.get(b.params);
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
