import type { AtRule, ChildNode, Container, Declaration, Document } from 'postcss';

const blockedParentAtRules = new Set(['function', 'keyframes']);
const GENERATED_PREFIX = '--csstools-custom-function';

export function isProcessableDeclaration(decl: Declaration): boolean {
	if (decl.prop.startsWith(GENERATED_PREFIX)) {
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
