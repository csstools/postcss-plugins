export function hasSupportsAtRuleAncestor(node) {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if (parent.name === 'supports') {
			if (
				parent.params.includes('conic-gradient(') ||
				parent.params.includes('linear-gradient(') ||
				parent.params.includes('radial-gradient(') ||
				parent.params.includes('repeating-conic-gradient(') ||
				parent.params.includes('repeating-linear-gradient(') ||
				parent.params.includes('repeating-radial-gradient(')
			) {
				return true;
			}
		}

		parent = parent.parent;
	}

	return false;
}
