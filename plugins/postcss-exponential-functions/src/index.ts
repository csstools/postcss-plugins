import type { PluginCreator } from 'postcss';
import { calc } from '@csstools/css-calc';

/** postcss-exponential-functions plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const FUNCTION_CALL_REGEXP = /(?<![-\w])(?:exp|hypot|log|pow|sqrt)\(/i;

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
		postcssPlugin: 'postcss-exponential-functions',
		Declaration(decl) {
			if (!FUNCTION_CALL_REGEXP.test(decl.value)) {
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
