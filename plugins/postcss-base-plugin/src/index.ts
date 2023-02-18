import type { PluginCreator } from 'postcss';

/** postcss-base-plugin plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Replacement color */
	color?: string,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			color: null,
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-base-plugin',
		Declaration(decl) {
			if (decl.value === 'red') {
				// Determine the new value.
				let newValue = 'blue';
				if (options.color) {
					newValue = options.color;
				}

				// Check if it is different from the current value.
				if (newValue === decl.value) {
					return;
				}

				// Insert the new value before the current value.
				decl.cloneBefore({
					prop: 'color',
					value: newValue,
				});

				// If the current value is preserved we are done and return here.
				if (options.preserve) {
					return;
				}

				// If the current value is not preserved we remove it.
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
