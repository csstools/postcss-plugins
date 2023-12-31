import type { Root } from 'postcss';
import valuesParser from 'postcss-value-parser';
import { cascadeLayerNumberForNode, collectCascadeLayerOrder } from './cascade-layers';
import { isBlockIgnored, isDeclarationIgnored } from './is-ignored';
import { HTML_SELECTOR_REGEX, HTML_WHERE_SELECTOR_REGEX, MAYBE_HTML_OR_ROOT_RULE_REGEX, ROOT_SELECTOR_REGEX, ROOT_WHERE_SELECTOR_REGEX, isProcessableRule } from './is-processable-rule';
import { isVarFunction } from './is-var-function';
import { removeCyclicReferences } from './toposort';
import { parseOrCached } from './parse-or-cached';

// return custom selectors from the css root, conditionally removing them
export default function getCustomPropertiesFromRoot(root: Root, parsedValuesCache: Map<string, valuesParser.ParsedValue>): Map<string, valuesParser.ParsedValue> {
	const customProperties: Map<string, string> = new Map();
	const customPropertiesPriorityMapping: Map<string, number> = new Map();

	const cascadeLayersOrder = collectCascadeLayerOrder(root);

	// for each html or :root rule
	root.walkRules((rule) => {
		if (!MAYBE_HTML_OR_ROOT_RULE_REGEX.test(rule.selector) || !rule.nodes?.length) {
			return;
		}

		if (!isProcessableRule(rule)) {
			return;
		}

		if (isBlockIgnored(rule)) {
			return;
		}

		rule.selectors.forEach((selector) => {
			let specificity = -1;

			if (HTML_WHERE_SELECTOR_REGEX.test(selector) || ROOT_WHERE_SELECTOR_REGEX.test(selector)) {
				specificity = 0;
			} else if (HTML_SELECTOR_REGEX.test(selector)) {
				specificity = 1;
			} else if (ROOT_SELECTOR_REGEX.test(selector)) {
				specificity = 2;
			} else {
				return;
			}

			const thisPriority = (cascadeLayerNumberForNode(rule, cascadeLayersOrder) + 10) + specificity;

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


				const priority = customPropertiesPriorityMapping.get(decl.prop) ?? -1;

				if (thisPriority >= priority) {
					customPropertiesPriorityMapping.set(decl.prop, thisPriority);
					customProperties.set(decl.prop, decl.value);
				}
			});
		});
	});

	const customPropertyGraph: Array<[string, string]> = [];
	const out: Map<string, valuesParser.ParsedValue> = new Map();

	for (const [name, value] of customProperties.entries()) {
		const parsedValue = parseOrCached(value, parsedValuesCache);

		valuesParser.walk(parsedValue.nodes, (node) => {
			if (isVarFunction(node)) {
				const [nestedVariableNode] = node.nodes.filter((x) => x.type === 'word');

				customPropertyGraph.push([nestedVariableNode.value, name]);
			}
		});

		out.set(name, parsedValue);
	}

	removeCyclicReferences(out, customPropertyGraph);

	// return all custom properties, preferring :root properties over html properties
	return out;
}
