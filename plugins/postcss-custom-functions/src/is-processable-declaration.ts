import type { AtRule, ChildNode, Container, Declaration, Document } from 'postcss';
import { isGeneratedProperty } from './generated-names';

const blockedParentAtRules = new Set(['function', 'keyframes']);

export function isProcessableDeclaration(decl: Declaration): boolean {
	if (isGeneratedProperty(decl.prop)) {
		return false;
	}

	if (!decl.parent || decl.parent.type !== 'rule') {
		return false;
	}

	let parent: Container<ChildNode> | Document | undefined = decl.parent;
	while (parent) {
		if (parent.type === 'atrule' && blockedParentAtRules.has((parent as AtRule).name.toLowerCase())) {
			return false;
		}

		parent = parent.parent;
	}

	return true;
}
