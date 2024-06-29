import type { Plugin, PluginCreator } from 'postcss';

const prefersInterfaceRegExp = /\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)/gi;

const colorDepthByStyle = { dark: '(color: 48842621)', light: '(color: 70318723)' };

/** postcss-prefers-color-scheme plugin options */
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
		postcssPlugin: 'postcss-prefers-color-scheme',
		prepare(): Plugin {
			const transformedNodes = new WeakSet();

			return {
				postcssPlugin: 'postcss-prefers-color-scheme',
				AtRule(atRule): void {
					if (transformedNodes.has(atRule)) {
						return;
					}

					if (atRule.name.toLowerCase() !== 'media') {
						return;
					}

					const { params } = atRule;
					const altParamsColorDepth = params.replace(prefersInterfaceRegExp, ($0, style: string) => {
						if (style.toLowerCase() === 'dark') {
							return colorDepthByStyle.dark;
						}

						if (style.toLowerCase() === 'light') {
							return colorDepthByStyle.light;
						}

						return $0;
					});
					if (params === altParamsColorDepth) {
						return;
					}

					transformedNodes.add(atRule);
					atRule.cloneBefore({ params: altParamsColorDepth });

					if (!options.preserve) {
						atRule.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

