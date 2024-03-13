import type { PluginCreator } from 'postcss';
import { transformMediaQueryList } from './transform-media-query-list';

/** postcss-media-queries-aspect-ratio-number-values plugin options */
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
		postcssPlugin: 'postcss-media-queries-aspect-ratio-number-values',
		AtRule(atRule, { result }): void {
			if (atRule.name.toLowerCase() !== 'media') {
				return;
			}

			const lowerCaseParams = atRule.params.toLowerCase();
			if (!(
				lowerCaseParams.includes('aspect-ratio') ||
				lowerCaseParams.includes('min-aspect-ratio') ||
				lowerCaseParams.includes('max-aspect-ratio') ||
				lowerCaseParams.includes('device-aspect-ratio') ||
				lowerCaseParams.includes('min-device-aspect-ratio') ||
				lowerCaseParams.includes('max-device-aspect-ratio')
			)) {
				return;
			}

			let modifiedParams: string;
			try {
				modifiedParams = transformMediaQueryList(atRule.params, options.preserve);
				if (modifiedParams === atRule.params) {
					return;
				}
			} catch (err) {
				atRule.warn(result, `Failed to transform @media params for "${atRule.params}" with message: "${(err instanceof Error) ? err.message : err}"`);
				return;
			}

			atRule.cloneBefore({ params: modifiedParams });
			atRule.remove();
		},
	};
};

creator.postcss = true;

export default creator;

