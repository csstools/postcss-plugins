import type { PluginCreator } from 'postcss';

/** postcss-fit-tolerance-property plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const FIT_TOLERANCE_REGEX = /^fit-tolerance$/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: true,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-fit-tolerance-property',
		Declaration(decl): void {
			if (!FIT_TOLERANCE_REGEX.test(decl.prop)) {
				return;
			}

			// Insert the new value before the current value.
			decl.cloneBefore({
				prop: 'flow-tolerance',
			});

			// If the current value is preserved we are done and return here.
			if (options.preserve) {
				return;
			}

			// If the current value is not preserved we remove it.
			decl.remove();
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
