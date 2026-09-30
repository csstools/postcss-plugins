import type { PluginCreator } from 'postcss';
import { calc } from '@csstools/css-calc';

/** postcss-stepped-value-functions plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const FUNCTION_CALL_REGEX = /(?<![-\w])(?:mod|rem|round)\(/i;
const IS_PROPERTY_REGEX = /^property$/i;

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
		postcssPlugin: 'postcss-stepped-value-functions',
		Declaration(decl): void {
			if (!FUNCTION_CALL_REGEX.test(decl.value)) {
				return;
			}

			if (options.preserve && decl.parent?.type === 'atrule' && IS_PROPERTY_REGEX.test(decl.parent.name)) {
				return;
			}

			const modifiedValue = calc(decl.value, {
				precision: 5,
				toCanonicalUnits: true,
				calcWrapper: true,
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
