import type { PluginCreator } from 'postcss';
import { convert } from '@csstools/css-calc';

/** postcss-stepped-value-functions plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
			onInvalid: '',
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-stepped-value-functions',
		Declaration(decl) {
			const checks = [
				'mod(',
				'rem(',
				'round(',
			];

			const hasSupportedFunction = checks.some(functionCheck => decl.value.toLowerCase().includes(functionCheck));

			if (!decl || !hasSupportedFunction) {
				return;
			}

			const modifiedValue = convert(decl.value, { precision: 5 });
			if (modifiedValue === decl.value) {
				return;
			}

			const stillHasSupportedFunction = checks.some(functionCheck => modifiedValue.toLowerCase().includes(functionCheck));
			if (stillHasSupportedFunction) {
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
