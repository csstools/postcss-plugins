// overflow shorthand property matcher
const overflowPropertyRegExp = /^overflow/i;

function onCSSDeclaration(postcssList, decl, preserve) {
	// split the declaration values
	const [overflowX, overflowY, ...invalidatingValues] = postcssList.space(decl.value);

	// if there are two values, but no invalidating values
	if (overflowY && !invalidatingValues.length) {
		// insert the overflow-* longhand declarations
		decl.cloneBefore({
			prop: `${decl.prop}-x`,
			value: overflowX,
		});

		decl.cloneBefore({
			prop: `${decl.prop}-y`,
			value: overflowY,
		});

		// conditionally remove the original declaration
		if (!preserve) {
			decl.remove();
		}
	}
}

const creator = opts => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-overflow-shorthand',
		Declaration: (decl, { list }) => {
			if (overflowPropertyRegExp.test(decl)) {
				onCSSDeclaration(list, decl, preserve);
			}
		},
	};
};

creator.postcss = true;

export default creator;
