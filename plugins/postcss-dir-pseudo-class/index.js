// tooling
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

// plugin
module.exports = postcss.plugin('postcss-dir-pseudo-class', () => (root) => {
	root.walkRules(/:dir\([^\)]*\)/, (rule) => {
		rule.selector = selectorParser((selectors) => {
			selectors.nodes.forEach(
				(selector) => {
					selector.walk((node) => {
						// ...
						if ('pseudo' === node.type && ':dir' === node.value) {
							const prev = node.prev();
							const prevIsSpaceCombinator = prev && prev.type && 'combinator' === prev.type && ' ' === prev.value;

							const next = node.next();
							const nextIsSpaceCombinator = next && next.type && 'combinator' === next.type && ' ' === next.value;

							if (prevIsSpaceCombinator && (nextIsSpaceCombinator || !next)) {
								node.replaceWith(
									selectorParser.universal()
								);
							} else {
								node.remove();
							}

							const first = selector.nodes[0];
							const firstIsSpaceCombinator = first && 'combinator' === first.type && ' ' === first.value;

							if (first && !firstIsSpaceCombinator) {
								selector.prepend(
									selectorParser.combinator({
										value: ' '
									})
								);
							}

							selector.prepend(
								selectorParser.attribute({
									attribute: 'dir',
									operator: '=',
									value: `"${ node.nodes.toString() }"`
								})
							);
						}
					});
				}
			);
		}).process(rule.selector).result;
	});
});
