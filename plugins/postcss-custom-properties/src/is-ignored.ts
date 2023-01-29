import type { Comment, Container, Declaration, Node } from 'postcss';

const blockRegExp = /(!\s*)?postcss-custom-properties:\s*off\b/i;

const blockIgnoredCache = new WeakMap();

function isBlockIgnored(container: Container) {
	if (!container || !container.nodes) {
		return false;
	}

	if (blockIgnoredCache.has(container)) {
		return blockIgnoredCache.get(container);
	}

	const result = container.some((child) => isIgnoreComment(child, blockRegExp));
	blockIgnoredCache.set(container, result);

	return result;
}

const declarationRegExp = /(!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i;

function isDeclarationIgnored(decl: Declaration) {
	if (!decl) {
		return false;
	}

	if (isBlockIgnored(decl.parent)) {
		return true;
	}

	return isIgnoreComment(decl.prev(), declarationRegExp);
}

function isIgnoreComment(node: Node, regexp: RegExp) {
	return node && node.type === 'comment' && regexp.test((node as Comment).text);
}

export {
	isBlockIgnored,
	isDeclarationIgnored,
};
