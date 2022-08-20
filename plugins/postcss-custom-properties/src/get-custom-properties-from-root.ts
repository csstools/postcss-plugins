import { Root, Rule } from 'postcss';
import valuesParser from 'postcss-value-parser';
import { isBlockIgnored } from './is-ignored';

// return custom selectors from the css root, conditionally removing them
export default function getCustomPropertiesFromRoot(root: Root): Map<string, valuesParser.ParsedValue> {
	// initialize custom selectors
	const customPropertiesFromHtmlElement: Map<string, valuesParser.ParsedValue> = new Map();
	const customPropertiesFromRootPseudo: Map<string, valuesParser.ParsedValue> = new Map();
	const out: Map<string, valuesParser.ParsedValue> = new Map();

	// for each html or :root rule
	root.each((rule) => {
		if (rule.type !== 'rule') {
			return;
		}

		if (isHtmlRule(rule)) {
			rule.each((decl) => {
				if (decl.type !== 'decl') {
					return;
				}

				if (!decl.variable || isBlockIgnored(decl)) {
					return;
				}

				customPropertiesFromHtmlElement.set(decl.prop, valuesParser(decl.value));
			});
		} else if (isRootRule(rule)) {
			rule.each((decl) => {
				if (decl.type !== 'decl') {
					return;
				}

				if (!decl.variable || isBlockIgnored(decl)) {
					return;
				}

				customPropertiesFromRootPseudo.set(decl.prop, valuesParser(decl.value));
			});
		}
	});

	for (const [name, value] of customPropertiesFromHtmlElement.entries()) {
		out.set(name, value);
	}

	for (const [name, value] of customPropertiesFromRootPseudo.entries()) {
		out.set(name, value);
	}

	// return all custom properties, preferring :root properties over html properties
	return out;
}

// match html and :root rules
const htmlSelectorRegExp = /^html$/i;
const rootSelectorRegExp = /^:root$/i;

function isHtmlRule(rule: Rule) {
	return rule.selector.split(',').some(item => htmlSelectorRegExp.test(item)) && rule.nodes && rule.nodes.length;
}

function isRootRule(rule: Rule) {
	return rule.selector.split(',').some(item => rootSelectorRegExp.test(item)) && rule.nodes && rule.nodes.length;
}
