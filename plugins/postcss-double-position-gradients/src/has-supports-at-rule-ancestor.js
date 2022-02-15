export function hasSupportsAtRuleAncestor(node) {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if (parent.name === 'supports') {
			if (parent.params.indexOf('conic-gradient(') !== -1) {
				return true;
			}

			if (parent.params.indexOf('linear-gradient(') !== -1) {
				return true;
			}

			if (parent.params.indexOf('radial-gradient(') !== -1) {
				return true;
			}

			if (parent.params.indexOf('repeating-conic-gradient(') !== -1) {
				return true;
			}

			if (parent.params.indexOf('repeating-linear-gradient(') !== -1) {
				return true;
			}

			if (parent.params.indexOf('repeating-radial-gradient(') !== -1) {
				return true;
			}
		}

		parent = parent.parent;
	}

	return false;
}
