import getReplacedValue from './lib/get-replaced-value'
import importEnvironmentVariablesFromSources from './lib/import-from'

/**
 * @param {{importFrom?: string[]}} opts
 * @returns {import('postcss').Plugin}
 */
export default function creator(opts) {
	// sources to import environment variables from
	const importFrom = [].concat(Object(opts).importFrom || [])

	// promise any environment variables are imported
	const environmentVariablesPromise = importEnvironmentVariablesFromSources(importFrom)

	return {
		postcssPlugin: 'postcss-env-fn',
		async AtRule(atRule, { result }) {
			let replacedValue

			try {
				replacedValue = getReplacedValue(atRule.params, await environmentVariablesPromise)
			} catch (error) {
				atRule.warn(
					result,
					`Failed to parse params '${atRule.params}' as an environment value. Leaving the original value intact.`
				)
			}

			if (typeof replacedValue === 'undefined') {
				return
			}

			if (replacedValue !== atRule.params) {
				atRule.params = replacedValue
			}
		},
		async Declaration(decl, { result }) {
			let replacedValue

			try {
				replacedValue = getReplacedValue(decl.value, await environmentVariablesPromise)
			} catch (error) {
				decl.warn(
					result,
					`Failed to parse value '${decl.value}' as an environment value. Leaving the original value intact.`
				)
			}

			if (typeof replacedValue === 'undefined') {
				return
			}

			if (replacedValue !== decl.value) {
				decl.value = replacedValue
			}
		}
	}
}

creator.postcss = true
