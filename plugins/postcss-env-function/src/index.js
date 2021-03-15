import getReplacedValue from './lib/get-replaced-value';
import importEnvironmentVariablesFromSources from './lib/import-from';

/**
 * @param {{importFrom?: string[]}} opts
 * @returns {import('postcss').Plugin}
 */
module.exports = function creator(opts) {
	// sources to import environment variables from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// promise any environment variables are imported
	const environmentVariablesPromise = importEnvironmentVariablesFromSources(importFrom);

	return {
		postcssPlugin: 'postcss-env-fn',
		async AtRule(atRule) {
			const replacedValue = getReplacedValue(atRule.params, await environmentVariablesPromise);

			if (replacedValue !== atRule.params) {
				atRule.params = replacedValue;
			}
		},
		async Declaration(decl) {
			const replacedValue = getReplacedValue(decl.value, await environmentVariablesPromise);

			if (replacedValue !== decl.value) {
				decl.value = replacedValue;
			}
		}
	};
};

module.exports.postcss = true;
