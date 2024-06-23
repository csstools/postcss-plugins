import type { Comment, Container, Declaration, Node } from 'postcss';

const blockRegExp = /(?:!\s*)?postcss-custom-properties:\s*off\b/i;

const blockIgnoredCache: WeakMap<Node, boolean> = new WeakMap();

export function isBlockIgnored(container: Container | undefined): boolean {
	if (!container || !container.nodes) {
		return false;
	}

	if (blockIgnoredCache.has(container)) {
		return blockIgnoredCache.get(container)!;
	}

	const result = container.some((child) => isIgnoreComment(child, blockRegExp));
	blockIgnoredCache.set(container, result);

	return result;
}

const DECLARATION_REG_EXP = /(?:!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i;

export function isDeclarationIgnored(decl: Declaration | undefined): boolean {
	if (!decl) {
		return false;
	}

	if (isBlockIgnored(decl.parent)) {
		return true;
	}

	return isIgnoreComment(decl.prev(), DECLARATION_REG_EXP);
}

function isIgnoreComment(node: Node | undefined, regexp: RegExp): boolean {
	return !!node && node.type === 'comment' && regexp.test((node as Comment).text);
}
