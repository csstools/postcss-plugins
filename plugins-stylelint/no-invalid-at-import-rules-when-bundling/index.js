const stylelint = require('stylelint');
const parseAtImport = require('./parse-at-import');

const ruleName = '@csstools/stylelint-no-invalid-at-import-rules-when-bundling';

const meta = {
	url: 'https://github.com/csstools/postcss-plugins/blob/main/plugins-stylelint/no-invalid-at-import-rules-when-bundling',
	fixable: true,
};

const ruleFunction = (primaryOption) => {
	return (postcssRoot, postcssResult) => {
		if (!primaryOption) {
			return;
		}

		postcssRoot.walkAtRules(/^import$/i, (atRule) => {
			const parsed = parseAtImport(atRule.params);
			if (!parsed) {
				return;
			}

			const { uri, uriSourceIndices } = parsed;

			{
				// Validate the uri

				if (uri.startsWith('/')) {
					stylelint.utils.report({
						message: 'URL\'s that start with a slash are ambiguous when bundling, use a relative URL instead.',
						node: atRule,
						index: atRuleParamIndex(atRule) + uriSourceIndices[0],
						endIndex: atRuleParamIndex(atRule) + uriSourceIndices[1] + 1,
						result: postcssResult,
						ruleName,
					});
				}

				{
					// uri as URL
					try {
						const url = parseAsURLOnlyWhenRelative(uri);
						if (url.search.length) {
							stylelint.utils.report({
								message: 'URL\'s that have query params can not be bundled correctly. Avoid these or add a \'http\' scheme and domain name.',
								node: atRule,
								index: atRuleParamIndex(atRule) + uriSourceIndices[0],
								endIndex: atRuleParamIndex(atRule) + uriSourceIndices[1] + 1,
								result: postcssResult,
								ruleName,
							});
						}
					} catch {
						// noop
					}
				}
			}
		});
	};
};

function atRuleParamIndex(atRule) {
	// Initial 1 is for the `@`
	let index = 1 + atRule.name.length;

	if (atRule.raws.afterName) {
		index += atRule.raws.afterName.length;
	}

	return index;
}

function parseAsURLOnlyWhenRelative(uri) {
	try {
		const url = new URL(uri);
		if (url.host) {
			return false;
		}

		if (url.protocol) {
			return false;
		}
	} catch {
		// noop
	}

	try {
		return new URL(uri, 'http://example.com');
	} catch {
		// noop
	}

	return false;
}

ruleFunction.ruleName = ruleName;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
