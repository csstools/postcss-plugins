const mediaRegExp = /^media$/i;
const prefersInterfaceRegExp = /\(\s*prefers-color-scheme\s*:\s*(dark|light|no-preference)\s*\)/i;
const colorIndexByStyle = { dark: 48, light: 70, 'no-preference': 22 };
const prefersInterfaceReplacer = ($0, style) => `(color-index: ${colorIndexByStyle[style.toLowerCase()]})`;

const creator = opts => {
	const preserve = 'preserve' in Object(opts) ? opts.preserve : true;

	return {
		postcssPlugin: 'postcss-prefers-color-scheme',
		AtRule: (atRule) => {
			if (!mediaRegExp.test(atRule.name)) {
				return;
			}

			const { params } = atRule;
			const altParams = params.replace(prefersInterfaceRegExp, prefersInterfaceReplacer);

			if (params !== altParams) {
				if (preserve) {
					atRule.cloneBefore({ params: altParams });
				} else {
					atRule.params = altParams;
				}
			}
		},
	};
};

creator.postcss = true;

export default creator;
