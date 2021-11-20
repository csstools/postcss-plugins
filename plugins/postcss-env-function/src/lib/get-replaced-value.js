import { parse } from 'postcss-values-parser'
import updateEnvValue from './update-env-value'
import walkEnvFuncs from './walk-env-funcs'

/**
 * @param {string} originalValue
 * @param variables
 * @returns {string} returns a value replaced with environment variables
 */
export default (originalValue, variables) => {
	// get the ast of the original value
	const ast = parse(originalValue, { ignoreUnknownWords: true })

	// walk all of the css env() functions
	walkEnvFuncs(ast, node => {
		// update the environment value for the css env() function
		updateEnvValue(node, variables)
	})

	// return the stringified ast
	return String(ast)
}
