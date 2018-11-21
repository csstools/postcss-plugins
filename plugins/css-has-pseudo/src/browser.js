export default function cssHas(document) {
	const hasPseudoRegExp = /^(.*?)\[:(not-)?has\((.+?)\)\]/;
	const observedCssRules = [];

	// walk all stylesheets to collect observed css rules
	Array.prototype.forEach.call(document.styleSheets, walkStyleSheet);
	transformObservedCssRules();

	// observe DOM modifications that affect selectors
	new MutationObserver(mutationsList => {
		mutationsList.forEach(mutation => {
			Array.prototype.forEach.call(mutation.addedNodes || [], node => {
				// walk stylesheets to collect observed css rules
				if (node.nodeType === 1 && node.sheet) {
					cleanupObservedCssRules();
					Array.prototype.forEach.call(document.styleSheets, walkStyleSheet);
				}
			});

			// transform observed css rules
			transformObservedCssRules();
		});
	}).observe(document, { childList: true, subtree: true });

	// observe DOM events that affect pseudo-selectors
	document.addEventListener('focus', () => setImmediate(transformObservedCssRules), true);
	document.addEventListener('blur', () => setImmediate(transformObservedCssRules), true);
	document.addEventListener('input', () => setImmediate(transformObservedCssRules));

	// transform observed css rules
	function transformObservedCssRules() {
		observedCssRules.forEach(
			item => {
				const nodes = [];

				Array.prototype.forEach.call(
					document.querySelectorAll(item.elementSelector),
					element => {
						const index = Array.prototype.indexOf.call(element.parentNode.children, element) + 1;
						const nextSelector = item.scopedSelectors.map(
							scopedSelector => item.elementSelector + ':nth-child(' + index + ') ' + scopedSelector
						).join();

						// find the :has element from the scope of the element
						const scopedElement = element.parentNode.querySelector(nextSelector);

						const shouldContinue = item.hasSelectorNot ? !scopedElement : scopedElement;

						if (shouldContinue) {
							// memorize the node
							nodes.push(element);

							// set the encoded attribute on the node
							setAttribute(element, item.encodedAttributeName);

							// trigger a style refresh in IE and Edge
							document.documentElement.style.zoom = 1; document.documentElement.style.zoom = null;
						}
					}
				);

				// remove the encoded attribute from all nodes that no longer match them
				item.nodes.splice(0).forEach(node => {
					if (nodes.indexOf(node) === -1) {
						node.removeAttribute(item.encodedAttributeName);

						// trigger a style refresh in IE and Edge
						document.documentElement.style.zoom = 1; document.documentElement.style.zoom = null;
					}
				});

				item.nodes = nodes;
			}
		);
	}

	// remove any observed cssrules that no longer apply
	function cleanupObservedCssRules() {
		Array.prototype.push.apply(
			observedCssRules,
			observedCssRules.splice(0).filter(
				item => item.cssRule.parentStyleSheet &&
					item.cssRule.parentStyleSheet.ownerNode &&
					document.contains(item.cssRule.parentStyleSheet.ownerNode)
			)
		);
	}

	// walk a stylesheet to collect observed css rules
	function walkStyleSheet(styleSheet) {
		Array.prototype.forEach.call(styleSheet.cssRules, walkCssRule);
	}

	// walk a css rule to collect observed css rules
	function walkCssRule(cssRule) {
		hasPseudoRegExp.lastIndex = 0;

		// decode the selector text, unifying their design between most browsers and IE/Edge
		const selectorText = decodeHasPseudoSelector(cssRule.selectorText);
		const selectorTextMatches = selectorText.match(hasPseudoRegExp);

		if (selectorTextMatches) {
			const hasSelectorNot = selectorTextMatches[2];
			const elementSelector = selectorTextMatches[1];
			const scopedSelectors = selectorTextMatches[3].split(/\s*,\s*/);
			const encodedAttributeName = ':' + (hasSelectorNot ? 'not-' : '') + 'has(' + encodeAttributeName(selectorTextMatches[3]) + ')';

			observedCssRules.push({
				cssRule,
				hasSelectorNot,
				elementSelector,
				scopedSelectors,
				encodedAttributeName,
				nodes: []
			});
		}
	}

	// set an attribute with an irregular attribute name
	function setAttribute(target, attributeName) {
		const innerHTML = '<x ' + attributeName + '>';
		const x = document.createElement('x');
		x.innerHTML = innerHTML;
		const attribute = x.firstChild.attributes[0].cloneNode();

		target.attributes.setNamedItem(attribute);
	}

	// encode a :has() pseudo selector as an attribute name
	function encodeAttributeName(attributeName) {
		return encodeURIComponent(attributeName).replace(/%3A/g, ':').replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%2C/g, ',');
	}

	// decode the :has() pseudo selector
	function decodeHasPseudoSelector(hasPseudoText) {
		return decodeURIComponent(hasPseudoText.replace(/\\([^\\])/g, '$1'))
	}
}
