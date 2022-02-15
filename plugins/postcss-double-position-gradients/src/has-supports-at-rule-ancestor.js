import { includesGradientsFunction } from './is-gradient';

export function hasSupportsAtRuleAncestor(node) {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if (parent.name === 'supports' && includesGradientsFunction(parent.params)) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
