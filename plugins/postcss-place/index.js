// tooling
const postcss = require('postcss');
const parser  = require('postcss-value-parser');

// plugin
module.exports = postcss.plugin('postcss-place', ({
	prefix
} = {}) => (root) => {
	// property
	const prop = new RegExp(prefix ? '^-' + prefix + '-(content|items|self)' : '^place-(content|items|self)');

	root.walkDecls(prop, (decl) => {
		// alignment
		const alignment = decl.prop.match(prop)[1];

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
			prop: 'align-' + alignment,
			value: alignValue
		});

		decl.cloneBefore({
			prop: 'justify-' + alignment,
			value: justifyValue
		});

		// remove place-[alignment]
		decl.remove();
	});
});
