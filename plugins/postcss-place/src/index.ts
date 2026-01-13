import type { PluginCreator } from 'postcss';
import { onCSSDeclaration, PLACE_MATCH_REGEX } from './on-css-declaration';

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
		Declaration(decl, { result }): void {
			if (!PLACE_MATCH_REGEX.test(decl.prop)) {
				return;
			}

			onCSSDeclaration(decl, result, options);
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
