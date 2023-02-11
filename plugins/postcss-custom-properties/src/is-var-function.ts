import type { FunctionNode, Node } from 'postcss-value-parser';

// match var() functions
const varRegExp = /^var$/i;

// whether the node is a var() function
export function isVarFunction(node: Node): node is FunctionNode {
	return node.type === 'function' && varRegExp.test(node.value) && Object(node.nodes).length > 0;
}
