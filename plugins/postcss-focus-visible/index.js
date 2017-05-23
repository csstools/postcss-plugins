// tooling
const fs      = require('fs');
const postcss = require('postcss');
const parser  = require('postcss-selector-parser');

// plugin
module.exports = postcss.plugin('postcss-focus-ring', (opts) => (root) => { // eslint-disable-line consistent-return
	// transformed cache
	const transformed = [];

	// walk each matching rule
	root.walkRules(/:focus-ring\b/, (rule) => {
		// original selector
		const originalSelector = rule.selector;

		// transformed selector
		const transformedSelector = parser((selectors) => {
			// for each selector part
			selectors.walk((selector) => {
				// if the selector part is a :focus-ring pseudo
				if (selector.type === 'pseudo' && selector.value === ':focus-ring') {
					// change it to a .focus-ring class
					selector.value = '.focus-ring';
					selector.type = 'class';
				}
			});
		}).process(originalSelector).result;

		// if the selector has changed
		if (originalSelector !== transformedSelector) {
			// update the rule’s selector
			rule.selector = transformedSelector;

			// push the transformed selector into the transformed cache
			transformed.push.apply(transformed, rule.selectors);
		}
	});

	// filter the transformed cache of repeats
	const transformedClean = transformed.filter((selector, index) => transformed.indexOf(selector) === index);

	// if the assignTo option is enabled
	if (opts && opts.assignTo) {
		// push the transformed cache into the assignTo option
		opts.assignTo.push.apply(opts.assignTo, transformedClean);
	}

	// if the exportAs option is enabled
	if (opts && opts.exportAs) {
		// destination path
		const destination = `${ opts.destination || `${
			root.source && root.source.input && root.source.input.file && root.source.input.file || 'css'
		}.focus-ring-selectors.${ opts.exportAs === 'js' ? 'js' : 'json' }` }`;

		// stringified contents
		const json = JSON.stringify(transformedClean, null, '  ');
		const contents = opts.exportAs === 'js' ? `export default ${ json };` : json;

		return new Promise((resolve, reject) => {
			fs.writeFile(destination, contents, (error) => error ? reject(error) : resolve());
		});
	}
});
