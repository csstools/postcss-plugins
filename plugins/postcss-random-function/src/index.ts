import type { PluginCreator } from 'postcss';
import { calc } from '@csstools/css-calc';
import { randomCacheKeyFromPostcssDeclaration } from './cache-key';

/** postcss-random-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const FUNCTION_CALL_REGEX = /(?<![-\w])(?:random)\(/i;

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
		postcssPlugin: 'postcss-random-function',
		Declaration(decl): void {
			if (!FUNCTION_CALL_REGEX.test(decl.value)) {
				return;
			}

			const modifiedValue = calc(decl.value, {
				precision: 5,
				toCanonicalUnits: true,
				randomCaching: randomCacheKeyFromPostcssDeclaration(decl),
			});
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
export { creator as 'module.exports' };
