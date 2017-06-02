// tooling
const postcss        = require('postcss');
const selectorParser = require('postcss-selector-parser');

// plugin
module.exports = postcss.plugin('postcss-dir-pseudo-class', (opts) => (root) => {
	// walk rules using the :dir pseudo-class
	root.walkRules(/:dir\([^\)]*\)/, (rule) => {
		// update the rule selector
		rule.selector = selectorParser((selectors) => {
			// for each (comma separated) selector
			selectors.nodes.forEach(
				(selector) => {
					// walk all selector nodes that are :dir pseudo-classes
					selector.walk((node) => {
						if ('pseudo' === node.type && ':dir' === node.value) {
							// previous and next selector nodes
							const prev = node.prev();
							const next = node.next();

							const prevIsSpaceCombinator = prev && prev.type && 'combinator' === prev.type && ' ' === prev.value;
							const nextIsSpaceCombinator = next && next.type && 'combinator' === next.type && ' ' === next.value;

							// preserve the selector tree
							if (prevIsSpaceCombinator && (nextIsSpaceCombinator || !next)) {
								node.replaceWith(
									selectorParser.universal()
								);
							} else {
								node.remove();
							}

							// conditionally prepend a combinator before inserting the [dir] attribute
							const first = selector.nodes[0];
							const firstIsSpaceCombinator = first && 'combinator' === first.type && ' ' === first.value;

							if (first && !firstIsSpaceCombinator) {
								selector.prepend(
									selectorParser.combinator({
										value: ' '
									})
								);
							}

							// value of the :dir pseudo-class
							const value = node.nodes.toString();

							// prepend the dir attribute
							selector.prepend(
								selectorParser.attribute({
									attribute: 'dir',
									operator: '=',
									value: `"${ value }"`
								})
							);
						}
					});
				}
			);
		}).process(rule.selector).result;
	});
});
