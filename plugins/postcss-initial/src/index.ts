import type { PluginCreator } from 'postcss';

/** postcss-initial plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const HAS_INITIAL = /\binitial\b/i;
const IS_INITIAL = /^initial$/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-initial',
		Declaration(decl) {
			if (!HAS_INITIAL.test(decl.value)) {
				return;
			}


		},
	};
};

creator.postcss = true;

export default creator;
