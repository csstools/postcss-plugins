import postcss from 'postcss';

// space-separated values splitter
const { list: { space } } = postcss

// overflow shorthand property matcher
const overflowPropertyRegExp = /^overflow$/i;

export default postcss.plugin('postcss-overflow-shorthand', opts => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return root => {
		// for each overflow declaration
		root.walkDecls(overflowPropertyRegExp, decl => {
			// split the declaration values
			const [overflowX, overflowY, ...invalidatingValues] = space(decl.value);

			// if there are two values, but no invalidating values
			if (overflowY && !invalidatingValues.length) {
				// insert the overflow-* longhand declarations
				decl.cloneBefore({
					prop: `${decl.prop}-x`,
					value: overflowX
				});

				decl.cloneBefore({
					prop: `${decl.prop}-y`,
					value: overflowY
				});

				// conditionally remove the original declaration
				if (!preserve) {
					decl.remove();
				}
			}
		})
	};
});
