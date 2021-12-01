import valuesParser from 'postcss-value-parser';
import isEnvFunc from './is-env-func';

/**
 * @param {string} originalValue
 * @param variables
 * @returns {string} returns a value replaced with environment variables
 */
export default (originalValue, variables) => {
	// get the ast of the original value
	const ast = valuesParser(originalValue);

	ast.walk(node => {
		if (isEnvFunc(node)) {
			const [valueNode] = node.nodes;

			if (valueNode.type === 'word' && typeof variables[valueNode.value] !== 'undefined') {
				node.nodes = [];
				node.type = 'word';
				node.value = variables[valueNode.value];
			}
		}
	});

	// return the stringified ast
	return ast.toString();
};
