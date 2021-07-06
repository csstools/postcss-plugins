// gap shorthand property matcher
const gapPropertyRegExp = /^(column-gap|gap|row-gap)$/i;

// filter `display: grid` declarations
const isDisplayGrid = (node) => node.prop === 'display' && node.value === 'grid';

module.exports = function creator(opts) {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-gap-properties',
		// walk decl shorthand gap, column-gap, or row-gap declaration
		Declaration(decl) {
			if (gapPropertyRegExp.test(decl.prop) && decl.parent.some(isDisplayGrid)) {
				// insert a grid-* fallback declaration
				decl.cloneBefore({
					prop: `grid-${decl.prop}`
				});

				// conditionally remove the original declaration
				if (!preserve) {
					decl.remove();
				}
			}
		}
	}
}

module.exports.postcss = true;
