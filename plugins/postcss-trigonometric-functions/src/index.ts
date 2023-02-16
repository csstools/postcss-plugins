import type { PluginCreator } from 'postcss';
import { checks } from './checks';
import { calc } from './calc';

/** postcss-trigonometric-functions plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-trigonometric-functions',
		Declaration(decl) {
			const hasSupportedFunction = checks.some(functionCheck => decl.value.toLowerCase().includes(functionCheck));
			if (!hasSupportedFunction) {
				return;
			}

			const modifiedValue = calc(decl.value);
			if (modifiedValue === decl.value) {
				return;
			}

			decl.cloneBefore({ value: modifiedValue });

			if (!options.preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
