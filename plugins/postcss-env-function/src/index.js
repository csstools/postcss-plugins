import getReplacedValue from './lib/get-replaced-value';
import importEnvironmentVariablesFromSources from './lib/import-from';

/**
 * @param {{importFrom?: string[]}} opts
 * @returns {import('postcss').Plugin}
 */
export default function creator(opts) {
	// sources to import environment variables from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// promise any environment variables are imported
	const environmentVariablesPromise = importEnvironmentVariablesFromSources(importFrom);
	const disableDeprecationNotice = 'disableDeprecationNotice' in Object(opts) ? Boolean(opts.disableDeprecationNotice) : false;
	let didWarn = false;

	return {
		postcssPlugin: 'postcss-env-fn',
		async AtRule(atRule, { result }) {
			let replacedValue;

			try {
				replacedValue = getReplacedValue(atRule.params, await environmentVariablesPromise);
			} catch (error) {
				atRule.warn(
					result,
					`Failed to parse params '${atRule.params}' as an environment value. Leaving the original value intact.`,
				);
			}

			if (typeof replacedValue === 'undefined') {
				return;
			}

			if (replacedValue !== atRule.params) {
				atRule.params = replacedValue;

				if (!disableDeprecationNotice && !didWarn) {
					didWarn= true;
					atRule.warn(result, 'postcss-env-function is deprecated and will be removed.\nCheck the discussion on github for more details. https://github.com/csstools/postcss-plugins/discussions/192');
				}
			}
		},
		async Declaration(decl, { result }) {
			let replacedValue;

			try {
				replacedValue = getReplacedValue(decl.value, await environmentVariablesPromise);
			} catch (error) {
				decl.warn(
					result,
					`Failed to parse value '${decl.value}' as an environment value. Leaving the original value intact.`,
				);
			}

			if (typeof replacedValue === 'undefined') {
				return;
			}

			if (replacedValue !== decl.value) {
				decl.value = replacedValue;

				if (!disableDeprecationNotice && !didWarn) {
					didWarn = true;
					decl.warn(result, 'postcss-env-function is deprecated and will be removed.\nWe are looking for insights and anecdotes on how these features are used so that we can design the best alternative.\nPlease let us know if our proposal will work for you.\nVisit the discussion on github for more details. https://github.com/csstools/postcss-plugins/discussions/192');
				}
			}
		},
	};
}

creator.postcss = true;
