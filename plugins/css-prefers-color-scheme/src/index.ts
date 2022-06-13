import type { PluginCreator } from 'postcss';

const prefersInterfaceRegExp = /\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)/gi;

const colorDepthByStyle = { dark: '48842621', light: '70318723' };
const prefersInterfaceColorDepthReplacer = ($0, style) => `(color: ${colorDepthByStyle[style.toLowerCase()]})`;

type pluginOptions = { preserve?: boolean };

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
		AtRule: (atRule) => {
			if (atRule.name !== 'media') {
				return;
			}

			const { params } = atRule;
			const altParamsColorDepth = params.replace(prefersInterfaceRegExp, prefersInterfaceColorDepthReplacer);
			if (params === altParamsColorDepth) {
				return;
			}

			atRule.cloneBefore({ params: altParamsColorDepth });

			if (!options.preserve) {
				atRule.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;

