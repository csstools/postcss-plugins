const postcss = require('postcss');
const stylelint = require('stylelint');

const ruleName = '@csstools/stylelint-no-invalid-at-import-rules-when-bundling';
const messages = stylelint.utils.ruleMessages(ruleName, {
	rejected: () => {
		return '@nest is deprecated and was removed from the specification. Use a regular selector instead.';
	},
});

const meta = {
	url: 'https://github.com/csstools/postcss-plugins/blob/main/plugins-stylelint/no-invalid-at-import-rules-when-bundling',
	fixable: true,
};

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
	return (postcssRoot, postcssResult) => {
		if (!primaryOption) {
			return;
		}

		postcssRoot.walkAtRules(/^nest$/i, (atrule) => {
			if (context.fix) {
				const rule = postcss.rule({
					selector: atrule.params,
					source: atrule.source,
				});

				atrule.nodes.forEach((node) => {
					rule.append(node);
				});

				atrule.replaceWith(rule);

				return;
			}

			stylelint.utils.report({
				message: messages.rejected(),
				node: atrule,
				index: 0,
				endIndex: 5,
				result: postcssResult,
				ruleName,
			});
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
