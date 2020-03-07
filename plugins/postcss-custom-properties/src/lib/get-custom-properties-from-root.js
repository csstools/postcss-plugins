import { parse } from 'postcss-values-parser';
import { isBlockIgnored } from './is-ignored';

// return custom selectors from the css root, conditionally removing them
export default function getCustomPropertiesFromRoot(root, opts) {
	// initialize custom selectors
	const customPropertiesFromHtmlElement = {};
	const customPropertiesFromRootPseudo = {};

	// for each html or :root rule
	root.nodes.slice().forEach(rule => {
		const customPropertiesObject = isHtmlRule(rule)
			? customPropertiesFromHtmlElement
		: isRootRule(rule)
			? customPropertiesFromRootPseudo
		: null;

		// for each custom property
		if (customPropertiesObject) {
			rule.nodes.slice().forEach(decl => {
				if (isCustomDecl(decl) && !isBlockIgnored(decl)) {
					const { prop } = decl;

					// write the parsed value to the custom property
					customPropertiesObject[prop] = parse(decl.value).nodes;

					// conditionally remove the custom property declaration
					if (!opts.preserve) {
						decl.remove();
					}
				}
			});

			// conditionally remove the empty html or :root rule
			if (!opts.preserve && isEmptyParent(rule) && !isBlockIgnored(rule)) {
				rule.remove();
			}
		}
	});

	// return all custom properties, preferring :root properties over html properties
	return { ...customPropertiesFromHtmlElement, ...customPropertiesFromRootPseudo };
}

// match html and :root rules
const htmlSelectorRegExp = /^html$/i;
const rootSelectorRegExp = /^:root$/i;
const customPropertyRegExp = /^--[A-z][\w-]*$/;

// whether the node is an html or :root rule
const isHtmlRule = node => node.type === 'rule' && node.selector.split(',').some(item => htmlSelectorRegExp.test(item)) && Object(node.nodes).length;
const isRootRule = node => node.type === 'rule' && node.selector.split(',').some(item => rootSelectorRegExp.test(item)) && Object(node.nodes).length;

// whether the node is an custom property
const isCustomDecl = node => node.type === 'decl' && customPropertyRegExp.test(node.prop);

// whether the node is a parent without children
const isEmptyParent = node => Object(node.nodes).length === 0;
