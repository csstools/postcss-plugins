import postcss from 'postcss';
import parser from 'postcss-value-parser';

const placeMatch = /^place-(content|items|self)/;

export default postcss.plugin('postcss-place', opts => {
	// prepare options
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.prefix) : true;

	return root => {
		// walk each matching declaration
		root.walkDecls(placeMatch, decl => {
			// alignment
			const alignment = decl.prop.match(placeMatch)[1];

			// value
			const value = parser(decl.value);

			// divider position
			const index = value.nodes.map(
				(node) => node.type
			).indexOf('space');

			// new justify-[alignment] and align-[alignment] declarations
			const alignValue = index === -1 ? decl.value : parser.stringify(value.nodes.slice(0, index));
			const justifyValue = index === -1 ? decl.value : parser.stringify(value.nodes.slice(index + 1));

			decl.cloneBefore({
				prop: `align-${alignment}`,
				value: alignValue
			});

			decl.cloneBefore({
				prop: `justify-${alignment}`,
				value: justifyValue
			});

			// conditionally remove place-[alignment]
			if (!preserve) {
				decl.remove();
			}
		});
	};
});
