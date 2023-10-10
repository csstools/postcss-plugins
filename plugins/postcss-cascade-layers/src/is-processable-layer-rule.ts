import type { AtRule, ChildNode, Container, Document } from 'postcss';
import { IS_LAYER } from './constants';

const allowedParentAtRules = new Set(['layer', 'supports', 'media', 'container', 'scope']);

export function isProcessableLayerRule(atRule: AtRule): boolean {
	if (atRule.type !== 'atrule') {
		return false;
	}

	if (!IS_LAYER.test(atRule.name)) {
		return false;
	}

	let parent: Container<ChildNode> | Document | undefined = atRule.parent;
	while (parent) {
		if (parent.type === 'rule') {
			return false;
		}

		if (parent.type === 'atrule' && !allowedParentAtRules.has((parent as AtRule).name.toLowerCase())) {
			return false;
		}

		parent = parent.parent;
	}

	return true;
}
