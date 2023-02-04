import type { PluginCreator } from 'postcss';

const prefersInterfaceRegExp = /\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)/gi;

const colorDepthByStyle = { dark: '48842621', light: '70318723' };
const prefersInterfaceColorDepthReplacer = ($0, style) => `(color: ${colorDepthByStyle[style.toLowerCase()]})`;

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
		prepare() {
			const transformed = new WeakSet();

			return {
				AtRule: (atRule) => {
					if (transformed.has(atRule)) {
						return;
					}

					if (atRule.name.toLowerCase() !== 'media') {
						return;
					}

					const { params } = atRule;
					const altParamsColorDepth = params.replace(prefersInterfaceRegExp, prefersInterfaceColorDepthReplacer);
					if (params === altParamsColorDepth) {
						return;
					}

					transformed.add(atRule);
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

