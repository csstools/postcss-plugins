import isEnvFunc from './is-env-func';

// walks a node recursively and runs a function using its children
export default function walk (node, fn) {
	node.nodes.slice(0).forEach(childNode => {
		if (childNode.nodes) {
			walk(childNode, fn);
		}

		if (isEnvFunc(childNode)) {
			fn(childNode);
		}
	});
}
