import type { Container, ChildNode } from 'postcss';

// Walks the container node and returns true when any node passes the condition.
export function someInTree(container: Container, predicate: (node: ChildNode) => boolean): boolean {
	let found = false;
	container.walk((node) => {
		if (predicate(node)) {
			found = true;
			return false;
		}
	});

	return found;
}
