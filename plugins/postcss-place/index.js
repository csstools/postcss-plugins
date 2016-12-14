// tooling
const postcss = require('postcss');
const parser  = require('postcss-value-parser');

// plugin
module.exports = postcss.plugin('postcss-place', ({
	prefix = ''
} = {}) => {
	// dashed prefix
	const dashedPrefix = prefix ? `-${ prefix }-` : '';

	// property matcher
	const propertyMatch = new RegExp(`^${ dashedPrefix }place-(content|items|self)`);

	return (root) => {
		// walk each matching declaration
		root.walkDecls(propertyMatch, (decl) => {
			// alignment
			const alignment = decl.prop.match(propertyMatch)[1];

			// value
			const value = parser(decl.value);

			// divider position
			const index = value.nodes.map(
				(node) => node.type
			).indexOf('space');

			// new justify-[alignment] and align-[alignment] declarations
			const alignValue   = index === -1 ? decl.value : parser.stringify(value.nodes.slice(0, index));
			const justifyValue = index === -1 ? decl.value : parser.stringify(value.nodes.slice(index + 1));

			decl.cloneBefore({
				prop: `align-${ alignment }`,
				value: alignValue
			});

			decl.cloneBefore({
				prop: `justify-${ alignment }`,
				value: justifyValue
			});

			// remove place-[alignment]
			decl.remove();
		});
	};
});

// override plugin#process
module.exports.process = function (cssString, pluginOptions, processOptions) {
	return postcss([
		0 in arguments ? module.exports(pluginOptions) : module.exports()
	]).process(cssString, processOptions);
};
