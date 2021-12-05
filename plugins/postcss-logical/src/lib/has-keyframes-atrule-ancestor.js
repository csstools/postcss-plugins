export function hasKeyframesAtRuleAncestor(node) {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if (parent.name === 'keyframes') {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
