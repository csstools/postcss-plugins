import { Root } from 'postcss';
import valuesParser from 'postcss-value-parser';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isBlockIgnored, isDeclarationIgnored } from './is-ignored';
import { isHtmlRule, isProcessableRule, isRootRule } from './is-processable-rule';

// return custom selectors from the css root, conditionally removing them
export default function getCustomPropertiesFromRoot(root: Root): Map<string, valuesParser.ParsedValue> {
	// initialize custom selectors
	const customPropertiesFromHtmlElement: Map<string, string> = new Map();
	const customPropertiesFromRootPseudo: Map<string, string> = new Map();
	const customProperties: Map<string, string> = new Map();

	const customPropertiesHtmlElementCascadeLayerMapping: Map<string, number> = new Map();
	const customPropertiesRootPseudoCascadeLayerMapping: Map<string, number> = new Map();

	const cascadeLayersOrder = collectCascadeLayerOrder(root);

	// for each html or :root rule
	root.walkRules((rule) => {
		if (!isProcessableRule(rule)) {
			return;
		}

		if (isBlockIgnored(rule)) {
			return;
		}

		if (isHtmlRule(rule)) {
			rule.each((decl) => {
				if (decl.type !== 'decl') {
					return;
				}

				if (!decl.variable || isDeclarationIgnored(decl)) {
					return;
				}

				if (decl.value.toLowerCase().trim() === 'initial') {
					return;
				}

				const thisCascadeLayer = cascadeLayerNumberForNode(decl, cascadeLayersOrder);
				const existingCascadeLayer = customPropertiesHtmlElementCascadeLayerMapping.get(decl.prop) ?? -1;

				if (thisCascadeLayer >= existingCascadeLayer) {
					customPropertiesHtmlElementCascadeLayerMapping.set(decl.prop, thisCascadeLayer);
					customPropertiesFromHtmlElement.set(decl.prop, decl.value);
				}
			});
		} else if (isRootRule(rule)) {
			rule.each((decl) => {
				if (decl.type !== 'decl') {
					return;
				}

				if (!decl.variable || isDeclarationIgnored(decl)) {
					return;
				}

				if (decl.value.toLowerCase().trim() === 'initial') {
					return;
				}

				const thisCascadeLayer = cascadeLayerNumberForNode(decl, cascadeLayersOrder);
				const existingCascadeLayer = customPropertiesRootPseudoCascadeLayerMapping.get(decl.prop) ?? -1;

				if (thisCascadeLayer >= existingCascadeLayer) {
					customPropertiesRootPseudoCascadeLayerMapping.set(decl.prop, thisCascadeLayer);
					customPropertiesFromRootPseudo.set(decl.prop, decl.value);
				}
			});
		}
	});

	for (const [name, value] of customPropertiesFromHtmlElement.entries()) {
		customProperties.set(name, value);
	}

	for (const [name, value] of customPropertiesFromRootPseudo.entries()) {
		customProperties.set(name, value);
	}

	const out: Map<string, valuesParser.ParsedValue> = new Map();
	for (const [name, value] of customProperties.entries()) {
		out.set(name, valuesParser(value));
	}

	// return all custom properties, preferring :root properties over html properties
	return out;
}
