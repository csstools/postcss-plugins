import type { PluginCreator } from 'postcss';
import { onCSSDeclaration, placeMatch } from './onCSSDeclaration';

/** postcss-place plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

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
		postcssPlugin: 'postcss-place',
		Declaration: (decl, { result }) => {
			if (!placeMatch.test(decl.prop.toLowerCase())) {
				return;
			}

			onCSSDeclaration(decl, result, options);
		},
	};
};

creator.postcss = true;

export default creator;
