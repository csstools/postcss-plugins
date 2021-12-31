/* global MutationObserver,requestAnimationFrame */

import '@mrhenry/core-web/modules/~element-qsa-has.js';
import extractEncodedSelectors from './encode/extract.mjs';

export default function cssHasPseudo(document, options) {
	if (!options) {
		options = {};
	}

	options = {
		hover: (!!options.hover) || false,
	};

	const observedItems = [];

	// document.createAttribute() doesn't support `:` in the name. innerHTML does
	const attributeElement = document.createElement('x');

	// walk all stylesheets to collect observed css rules
	[].forEach.call(document.styleSheets, walkStyleSheet);
	transformObservedItems();

	// observe DOM modifications that affect selectors
	const mutationObserver = new MutationObserver(mutationsList => {
		mutationsList.forEach(mutation => {
			[].forEach.call(mutation.addedNodes || [], node => {
				// walk stylesheets to collect observed css rules
				if (node.nodeType === 1 && node.sheet) {
					walkStyleSheet(node.sheet);
				}
			});

			// transform observed css rules
			cleanupObservedCssRules();
			transformObservedItems();
		});
	});

	mutationObserver.observe(document, { childList: true, subtree: true });

	// observe DOM events that affect pseudo-selectors
	document.addEventListener('focus', transformObservedItems, true);
	document.addEventListener('blur', transformObservedItems, true);
	document.addEventListener('input', transformObservedItems);

	if (options.hover) {
		if ('onpointerenter' in document) {
			document.addEventListener('pointerenter', transformObservedItems, true);
		} else {
			document.addEventListener('mouseover', transformObservedItems, true);
		}
	}

	// transform observed css rules
	function transformObservedItems () {
		requestAnimationFrame(() => {
			observedItems.forEach(
				item => {
					const nodes = [];

					[].forEach.call(
						document.querySelectorAll(item.selector),
						element => {
							// memorize the node
							nodes.push(element);

							// set an attribute with an irregular attribute name
							// document.createAttribute() doesn't support special characters
							attributeElement.innerHTML = '<x ' + item.attributeName + '>';

							element.setAttributeNode(attributeElement.children[0].attributes[0].cloneNode());

							// trigger a style refresh in IE and Edge
							document.documentElement.style.zoom = 1; document.documentElement.style.zoom = null;
						},
					);

					// remove the encoded attribute from all nodes that no longer match them
					item.nodes.forEach(node => {
						if (nodes.indexOf(node) === -1) {
							node.removeAttribute(item.attributeName);

							// trigger a style refresh in IE and Edge
							document.documentElement.style.zoom = 1; document.documentElement.style.zoom = null;
						}
					});

					// update the
					item.nodes = nodes;
				},
			);
		});
	}

	// remove any observed cssrules that no longer apply
	function cleanupObservedCssRules () {
		[].push.apply(
			observedItems,
			observedItems.splice(0).filter(
				item => item.rule.parentStyleSheet &&
					item.rule.parentStyleSheet.ownerNode &&
					document.documentElement.contains(item.rule.parentStyleSheet.ownerNode),
			),
		);
	}

	// walk a stylesheet to collect observed css rules
	function walkStyleSheet (styleSheet) {
		try {
			// walk a css rule to collect observed css rules
			[].forEach.call(styleSheet.cssRules || [], rule => {
				if (rule.selectorText) {
					// decode the selector text in all browsers to:
					const hasSelectors = extractEncodedSelectors(rule.selectorText);
					if (hasSelectors.length === 0) {
						return;
					}

					for (let i = 0; i < hasSelectors.length; i++) {
						const hasSelector = hasSelectors[i];
						observedItems.push({
							rule: rule,
							selector: hasSelector,
							attributeName: encodeURIComponent(hasSelector).replace(/%3A/g, ':').replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%2C/g, ','), // TODO : needs unit tests.
							nodes: [],
						});
					}
				} else {
					walkStyleSheet(rule);
				}
			});
		} catch (error) {
			/* do nothing and continue */
		}
	}
}
