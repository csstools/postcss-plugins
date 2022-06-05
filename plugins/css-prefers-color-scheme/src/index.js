const prefersInterfaceRegExp = /\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)/i;

const colorDepthByStyle = { dark: 48842621, light: 70318723 };
const prefersInterfaceColorDepthReplacer = ($0, style) => `(color: ${colorDepthByStyle[style.toLowerCase()]})`;

const creator = opts => {
	const preserve = 'preserve' in Object(opts) ? opts.preserve : true;

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

			if (!preserve) {
				atRule.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
