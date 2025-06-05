import type { AtRule, ChildNode, Container, Declaration, Document } from 'postcss';

const blockedParentAtRules = new Set(['keyframes']);

export function isProcessableDeclaration(decl: Declaration): boolean {
	let parent: Container<ChildNode> | Document | undefined = decl.parent;
	while (parent) {
		if (parent.type === 'atrule' && blockedParentAtRules.has((parent as AtRule).name.toLowerCase())) {
			return false;
		}

		parent = parent.parent;
	}

	return true;
}
