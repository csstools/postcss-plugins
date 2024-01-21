import type { FunctionNode, Node } from 'postcss-value-parser';

// match var() functions
const IS_VAR_FUNCTION_REGEX = /^var$/i;

// whether the node is a var() function
export function isVarFunction(node: Node): node is FunctionNode {
	return node.type === 'function' && IS_VAR_FUNCTION_REGEX.test(node.value) && Object(node.nodes).length > 0;
}

export const HAS_VAR_FUNCTION_REGEX = /var\(/i;
