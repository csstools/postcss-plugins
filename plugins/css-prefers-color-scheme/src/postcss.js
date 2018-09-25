import postcss from 'postcss';

const mediaRegExp = /^media$/i;
const prefersInterfaceRegExp = /\(\s*prefers-color-scheme\s*:\s*(dark|light|no-preference)\s*\)/i;
const colorIndexByStyle = { dark: 48, light: 70, 'no-preference': 22 };
const prefersInterfaceReplacer = ($0, style) => `(color-index: ${colorIndexByStyle[style.toLowerCase()]})`;

export default postcss.plugin('postcss-prefers-color-scheme', () => root => {
	root.walkAtRules(mediaRegExp, atRule => {
		const { params } = atRule;
		const altParams = params.replace(prefersInterfaceRegExp, prefersInterfaceReplacer);

		if (params !== altParams) {
			atRule.params = altParams;
		}
	});
});
