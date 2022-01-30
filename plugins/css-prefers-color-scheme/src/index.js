const mediaRegExp = /^media$/i;
const prefersInterfaceRegExp = /\(\s*prefers-color-scheme\s*:\s*(dark|light|no-preference)\s*\)/i;
const colorIndexByStyle = { dark: 48, light: 70, 'no-preference': 22 };
const prefersInterfaceColorIndexReplacer = ($0, style) => `(color-index: ${colorIndexByStyle[style.toLowerCase()]})`;


const colorDepthByStyle = { dark: 48842621, light: 70318723, 'no-preference': 22511989 };
const prefersInterfaceColorDepthReplacer = ($0, style) => `(color: ${colorDepthByStyle[style.toLowerCase()]})`;

const creator = opts => {
	const preserve = 'preserve' in Object(opts) ? opts.preserve : true;
	const mediaQueries = {};
	if (
		'mediaQuery' in Object(opts) &&
		(opts.mediaQuery === 'color-index' || opts.mediaQuery === 'color')
	) {
		mediaQueries[opts.mediaQuery] = true;
	} else {
		mediaQueries['color-index'] = true;
		mediaQueries['color'] = true;
	}

	return {
		postcssPlugin: 'postcss-prefers-color-scheme',
		AtRule: (atRule) => {
			if (!mediaRegExp.test(atRule.name)) {
				return;
			}

			const { params } = atRule;
			const altParamsColorIndex = params.replace(prefersInterfaceRegExp, prefersInterfaceColorIndexReplacer);
			const altParamsColorDepth = params.replace(prefersInterfaceRegExp, prefersInterfaceColorDepthReplacer);

			let didReplace = false;
			if (params !== altParamsColorIndex && mediaQueries['color-index']) {
				atRule.cloneBefore({ params: altParamsColorIndex });
				didReplace = true;
			}

			if (params !== altParamsColorDepth && mediaQueries['color']) {
				atRule.cloneBefore({ params: altParamsColorDepth });
				didReplace = true;
			}

			if (!preserve && didReplace) {
				atRule.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
