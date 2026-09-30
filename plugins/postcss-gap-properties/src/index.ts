import type { PluginCreator } from 'postcss';

/** postcss-gap-properties plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const gapProperties = [
	'column-gap',
	'gap',
	'row-gap',
];

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: true,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-gap-properties',
		// walk decl shorthand gap, column-gap, or row-gap declaration
		Declaration(decl): void {
			if (!gapProperties.includes(decl.prop.toLowerCase())) {
				return;
			}

			const isNotDisplayGrid = !(decl.parent?.some((node) => {
				if (node.type !== 'decl') {
					return false;
				}

				return node.prop.toLowerCase() === 'display' && node.value.toLowerCase() === 'grid';
			}));
			if (isNotDisplayGrid) {
				return;
			}

			const replacement = `grid-${decl.prop.toLowerCase()}`;
			const hasGridPrefixedDeclaration = decl.parent?.some((node) => {
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
			if (!options.preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
