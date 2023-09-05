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

		let localImportCounter = 0;

		postcssRoot.walkAtRules(/^import$/i, (atRule) => {
			const parsed = parseAtImport(atRule.params);
			if (!parsed) {
				// Invalid `@import` statement, best left to a Stylelint core rule
				return;
			}

			const { uri, uriSourceIndices } = parsed;

			{
				// Validate the uri

				if (uri.startsWith('/') && !uri.startsWith('//')) {
					stylelint.utils.report({
						message: 'URL\'s that start with a slash are ambiguous when bundling, use a relative URL instead.',
						node: atRule,
						index: atRuleParamIndex(atRule) + uriSourceIndices[0],
						endIndex: atRuleParamIndex(atRule) + uriSourceIndices[1] + 1,
						result: postcssResult,
						ruleName,
					});
				}

				if (uri.startsWith('#')) {
					stylelint.utils.report({
						message: 'URL\'s that start with a number sign (#) are invalid when bundling.',
						node: atRule,
						index: atRuleParamIndex(atRule) + uriSourceIndices[0],
						endIndex: atRuleParamIndex(atRule) + uriSourceIndices[1] + 1,
						result: postcssResult,
						ruleName,
					});
				}

				{
					// uri as URL
					const { url, remote } = parseAsURL(uri);
					if (url) {
						if (remote) {
							if (localImportCounter > 0) {
								stylelint.utils.report({
									message: 'Imports for remote resources after a local import will not be bundled correctly. Move these to the top of the file.',
									node: atRule,
									index: atRuleParamIndex(atRule) + uriSourceIndices[0],
									endIndex: atRuleParamIndex(atRule) + uriSourceIndices[1] + 1,
									result: postcssResult,
									ruleName,
								});
							}
						} else {
							localImportCounter++;
						}

						if (!remote && url.search.length) {
							stylelint.utils.report({
								message: 'URL\'s that have query params can not be bundled correctly. Avoid these or add a \'http(s)\' scheme and domain name.',
								node: atRule,
								index: atRuleParamIndex(atRule) + uriSourceIndices[0],
								endIndex: atRuleParamIndex(atRule) + uriSourceIndices[1] + 1,
								result: postcssResult,
								ruleName,
							});
						}

						if (!remote && uri.toLowerCase() !== uri) {
							stylelint.utils.report({
								message: 'URL\'s with uppercase characters might give conflicts between users on case sensitive or insensitive file systems. Use lower case characters only to avoid potential issues.',
								node: atRule,
								index: atRuleParamIndex(atRule) + uriSourceIndices[0],
								endIndex: atRuleParamIndex(atRule) + uriSourceIndices[1] + 1,
								result: postcssResult,
								ruleName,
							});
						}
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

function parseAsURL(uri) {
	const localProtocols = ['npm', 'node_modules'];

	try {
		const url = new URL(uri, 'https://454c178c-dadf-429e-8d9c-88e032826008.com');
		if (url.host && url.host !== '454c178c-dadf-429e-8d9c-88e032826008.com') {
			return {
				url: url,
				remote: !localProtocols.includes(url.protocol),
			};
		}

		return {
			url: url,
			remote: false,
		};
	} catch {
		return {
			url: null,
			remote: false,
		};
	}
}

ruleFunction.ruleName = ruleName;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
