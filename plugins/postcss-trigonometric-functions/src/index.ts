import type { PluginCreator } from 'postcss';
import { convert } from '@csstools/css-calc';

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
			const checks = [
				'asin(',
				'acos(',
				'atan(',
				'atan2(',
				'sin(',
				'cos(',
				'tan(',
			];

			const hasSupportedFunction = checks.some(functionCheck => decl.value.toLowerCase().includes(functionCheck));
			if (!hasSupportedFunction) {
				return;
			}

			const modifiedValue = convert(decl.value, { precision: 5, toCanonicalUnits: true });
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
