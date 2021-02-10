import postcss from 'postcss';

// gap shorthand property matcher
const gapPropertyRegExp = /^(column-gap|gap|row-gap)$/i;

// filter `display: grid` declarations
const isDisplayGrid = (node) => node.prop === 'display' && node.value === 'grid';

export default postcss.plugin('postcss-gap-properties', opts => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return root => {
		// for each shorthand gap, column-gap, or row-gap declaration
		root.walkDecls(gapPropertyRegExp, decl => {
			if (decl.parent.some(isDisplayGrid)) {
				// insert a grid-* fallback declaration
				decl.cloneBefore({
					prop: `grid-${decl.prop}`
				});

				// conditionally remove the original declaration
				if (!preserve) {
					decl.remove();
				}
			}
		})
	};
});
