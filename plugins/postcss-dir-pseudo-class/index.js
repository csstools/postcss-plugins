// tooling
const browserslist   = require('browserslist');
const postcss        = require('postcss');
const selectorParser = require('postcss-selector-parser');

// plugin
module.exports = postcss.plugin('postcss-dir-pseudo-class', (opts) => (root) => {
	// client browser list
	const clientBrowserList = browserslist(opts && opts.browsers, {
		path: root.source && root.source.input && root.source.input.file
	});

	// whether this library is needed
	const requiresPolyfill = clientBrowserList.some(
		(clientBrowser) => browserslist('chrome > 0, edge > 0, firefox <= 48, ie > 0, safari > 0').some(
			(polyfillBrowser) => polyfillBrowser === clientBrowser
		)
	);

	if (!requiresPolyfill) {
		return;
	}

	// walk rules using the :dir pseudo-class
	root.walkRules(/:dir\([^\)]*\)/, (rule) => {
		// update the rule selector
		rule.selector = selectorParser((selectors) => {
			// for each (comma separated) selector
			selectors.nodes.forEach((selector) => {
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
						const firstIsRoot = first && 'pseudo' === first.type && ':root' === first.value;

						if (first && !firstIsRoot && !firstIsSpaceCombinator) {
							selector.prepend(
								selectorParser.combinator({
									value: ' '
								})
							);
						}

						// value of the :dir pseudo-class
						const value = node.nodes.toString();

						// whether that value matches the presumed direction
						const isdir = opts && Object(opts).dir === value;

						selector.prepend(
							// prepend :root if the direction is presumed
							isdir ? selectorParser.pseudo({
								value: ':root'
							})
							// otherwise, prepend the dir attribute
							: selectorParser.attribute({
								attribute: 'dir',
								operator: '=',
								value: `"${ value }"`
							})
						);
					}
				});
			});
		}).process(rule.selector).result;
	});
});
