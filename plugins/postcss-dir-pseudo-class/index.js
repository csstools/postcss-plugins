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
						const firstIsHtml = first && 'tag' === first.type && 'html' === first.value;
						const firstIsRoot = first && 'pseudo' === first.type && ':root' === first.value;

						if (first && !firstIsHtml && !firstIsRoot && !firstIsSpaceCombinator) {
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

						// [dir] attribute
						const dirAttr = selectorParser.attribute({
							attribute: 'dir',
							operator:  '=',
							value:     `"${ value }"`
						});

						// not[dir] attribute
						const notDirAttr = selectorParser.pseudo({
							value: ':not'
						});

						notDirAttr.append(
							selectorParser.attribute({
								attribute: 'dir',
								operator:  '=',
								value:     `"${ 'ltr' === value ? 'rtl' : 'ltr' }"`
							})
						);

						if (isdir) {
							// if the direction is presumed
							if (firstIsHtml) {
								// insert :root after html tag
								selector.insertAfter(first, notDirAttr);
							} else {
								// prepend :root
								selector.prepend(notDirAttr);
							}
						} else if (firstIsHtml) {
							// otherwise, insert dir attribute after html tag
							selector.insertAfter(first, dirAttr);
						} else {
							// otherwise, prepend the dir attribute
							selector.prepend(dirAttr);
						}
					}
				});
			});
		}).process(rule.selector).result;
	});
});
