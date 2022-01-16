import parser from 'postcss-selector-parser';

const anyAnyLinkMatch = /:any-link/;

/**
 * @param {{preserve?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
function creator(opts) {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-pseudo-class-any-link',
		Rule(rule, { result }) {
			if (!anyAnyLinkMatch.test(rule.selector)) {
				return;
			}

			const rawSelector = rule.raws.selector && rule.raws.selector.raw || rule.selector;

			// workaround for https://github.com/postcss/postcss-selector-parser/issues/28#issuecomment-171910556
			if (rawSelector[rawSelector.length - 1] === ':') {
				return;
			}

			let updatedSelector;

			try {
				// update the selector
				updatedSelector = parser(selectors => {
					// cache variables
					let node;
					let nodeIndex;
					let selector;
					let selectorLink;
					let selectorVisited;

					// cache the selector index
					let selectorIndex = -1;

					// for each selector
					selector = selectors.nodes[++selectorIndex];
					while (selector) {
						// reset the node index
						nodeIndex = -1;

						// for each node
						node = selector.nodes[++nodeIndex];
						while (node) {
							// if the node value matches the any-link value
							if (node.value !== ':any-link' || node.type !== 'pseudo' || (node.nodes && node.nodes.length)) {
								node = selector.nodes[++nodeIndex];
								continue;
							}

							// clone the selector
							selectorLink = selector.clone();
							selectorVisited = selector.clone();

							// update the matching clone values
							selectorLink.nodes[nodeIndex].value = ':link';
							selectorVisited.nodes[nodeIndex].value = ':visited';

							// replace the selector with the clones and roll back the selector index
							selectors.nodes.splice(selectorIndex--, 1, selectorLink, selectorVisited);

							break;
						}

						selector = selectors.nodes[++selectorIndex];
					}
				}).processSync(rawSelector);
			} catch (_) {
				rule.warn(result, `Failed to parse selector : ${rule.selector}`);
				return;
			}

			if (typeof updatedSelector === 'undefined') {
				return;
			}

			if (updatedSelector === rawSelector) {
				return;
			}

			if (preserve) {
				rule.cloneBefore({
					selector: updatedSelector,
				});
			} else {
				rule.selector = updatedSelector;
			}
		},
	};
}

creator.postcss = true;

export default creator;
