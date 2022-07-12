// gap shorthand property matcher
const gapProperties = [
	'column-gap',
	'gap',
	'row-gap',
];

function creator(opts) {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-gap-properties',
		// walk decl shorthand gap, column-gap, or row-gap declaration
		Declaration(decl) {
			if (!gapProperties.includes(decl.prop.toLowerCase())) {
				return;
			}

			const isNotDisplayGrid = !(decl.parent.some((node) => {
				if (node.type !== 'decl') {
					return false;
				}

				return node.prop.toLowerCase() === 'display' && node.value.toLowerCase() === 'grid';
			}));
			if (isNotDisplayGrid) {
				return;
			}

			const replacement = `grid-${decl.prop.toLowerCase()}`;
			const hasGridPrefixedDeclaration = decl.parent.some((node) => {
				if (node.type !== 'decl') {
					return false;
				}

				return node.prop.toLowerCase() === replacement;
			});
			if (hasGridPrefixedDeclaration) {
				return;
			}

			// insert a grid-* fallback declaration
			decl.cloneBefore({
				prop: replacement,
			});

			// conditionally remove the original declaration
			if (!preserve) {
				decl.remove();
			}
		},
	};
}

creator.postcss = true;

export default creator;
