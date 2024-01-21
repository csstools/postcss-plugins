import stylelint from 'stylelint';
import { parseAtImport } from './parse-at-import.mjs';

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

		let didSeeImports = false;
		let didSeeOtherNodes = false;
		for (let i = 0; i < postcssRoot.nodes.length; i++) {
			const node = postcssRoot.nodes[i];
			if (i === 0 && node.type === 'atrule' && /^charset$/i.test(node.name)) {
				continue;
			}

			if (node.type === 'comment') {
				continue;
			}

			if (!didSeeImports && isLayerNode(node)) {
				continue;
			}

			if (!didSeeOtherNodes && isImportNode(node)) {
				didSeeImports = true;
				continue;
			}

			didSeeOtherNodes = true;

			if (isImportNode(node)) {
				stylelint.utils.report({
					message: '`@import` statements must be precede all other nodes except for `@charset` or `@layer` and all `@import` statements must be consecutive.',
					node: node,
					index: 0,
					endIndex: node.toString().length - 1,
					result: postcssResult,
					ruleName,
				});
			}
		}

		postcssRoot.walkAtRules(/^import$/i, (atRule) => {
			if ('nodes' in atRule) {
				stylelint.utils.report({
					message: '`@import` statements must not have any child nodes.',
					node: atRule,
					index: 0,
					endIndex: atRule.toString().length - 1,
					result: postcssResult,
					ruleName,
				});
			}

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
									message: '`@import` statements for remote resources after a local import will not be bundled correctly. Move these to the top of the file.',
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

function isLayerNode(node) {
	return node.type === 'atrule' && /^layer$/i.test(node.name) && !('nodes' in node);
}

function isImportNode(node) {
	return node.type === 'atrule' && /^import$/i.test(node.name);
}

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

export default stylelint.createPlugin(ruleName, ruleFunction);
