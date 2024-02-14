const aPlugin = () => {
	return {
		postcssPlugin: 'c-plugin',
		AtRule(atRule) {
			atRule.params = [atRule.params];
		},
	};
};

aPlugin.postcss = true;
aPlugin.postcssTapeSelfTest = true;

export default aPlugin;
