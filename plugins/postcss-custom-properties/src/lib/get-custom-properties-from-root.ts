import type { Declaration, Root, Rule } from 'postcss';

import valuesParser from 'postcss-value-parser';
import { isBlockIgnored, isDeclarationIgnored } from './is-ignored';
import { PluginOptions } from './options';

// return custom selectors from the css root, conditionally removing them
export default function getCustomPropertiesFromRoot(root: Root, opts: Pick<PluginOptions, 'preserve'>): Map<string, valuesParser.ParsedValue> {
	// initialize custom selectors
	const customPropertiesFromHtmlElement: Map<string, string> = new Map();
	const customPropertiesFromRootPseudo: Map<string, string> = new Map();
	const { preserve } = opts;

	// for each html or :root rule
	root.nodes.slice().forEach((rule: Rule) => {
		if (isBlockIgnored(rule)) {
			return;
		}

		const customPropertiesObject = isHtmlRule(rule)
			? customPropertiesFromHtmlElement
			: isRootRule(rule)
				? customPropertiesFromRootPseudo
				: null;

		// for each custom property
		if (customPropertiesObject) {
			rule.nodes.slice().forEach((decl: Declaration) => {
				const declarationCanBeRemoved = preserve === false ||
					(typeof preserve === 'function' && !preserve(decl));

				if (decl.variable && !isDeclarationIgnored(decl)) {
					const { prop } = decl;

					// write the parsed value to the custom property
					customPropertiesObject.set(prop, decl.value);

					// conditionally remove the custom property declaration
					if (declarationCanBeRemoved) {
						decl.remove();
					}
				}
			});

			// conditionally remove the empty html or :root rule
			if (!preserve && isEmptyParent(rule)) {
				rule.remove();
			}
		}
	});

	const out: Map<string, valuesParser.ParsedValue> = new Map();
	for (const [name, value] of customPropertiesFromHtmlElement.entries()) {
		out.set(name, valuesParser(value));
	}

	for (const [name, value] of customPropertiesFromRootPseudo.entries()) {
		out.set(name, valuesParser(value));
	}

	// return all custom properties, preferring :root properties over html properties
	return out;
}

// match html and :root rules
const htmlSelectorRegExp = /^html$/i;
const rootSelectorRegExp = /^:root$/i;

// whether the node is an html or :root rule
const isHtmlRule = node => node.type === 'rule' && node.selector.split(',').some(item => htmlSelectorRegExp.test(item)) && Object(node.nodes).length;
const isRootRule = node => node.type === 'rule' && node.selector.split(',').some(item => rootSelectorRegExp.test(item)) && Object(node.nodes).length;

// whether the node is a parent without children
const isEmptyParent = node => Object(node.nodes).length === 0;
