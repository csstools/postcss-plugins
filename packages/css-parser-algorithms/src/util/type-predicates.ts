import { CommentNode, FunctionNode, SimpleBlockNode, TokenNode, WhitespaceNode } from '../consume/component-block-function';

/**
 * Check if the current object is a `SimpleBlockNode`.
 * This is a type guard.
 */
export function isSimpleBlockNode(x: unknown): x is SimpleBlockNode {
	return SimpleBlockNode.isSimpleBlockNode(x);
}

/**
 * Check if the current object is a `FunctionNode`.
 * This is a type guard.
 */
export function isFunctionNode(x: unknown): x is FunctionNode {
	return FunctionNode.isFunctionNode(x);
}

/**
 * Check if the current object is a `WhitespaceNode`.
 * This is a type guard.
 */
export function isWhitespaceNode(x: unknown): x is WhitespaceNode {
	return WhitespaceNode.isWhitespaceNode(x);
}

/**
 * Check if the current object is a `CommentNode`.
 * This is a type guard.
 */
export function isCommentNode(x: unknown): x is CommentNode {
	return CommentNode.isCommentNode(x);
}

/**
 * Check if the current object is a `WhiteSpaceNode` or a `CommentNode`.
 * This is a type guard.
 */
export function isWhiteSpaceOrCommentNode(x: unknown): x is WhitespaceNode | CommentNode {
	return isWhitespaceNode(x) || isCommentNode(x);
}

/**
 * Check if the current object is a `TokenNode`.
 * This is a type guard.
 */
export function isTokenNode(x: unknown): x is TokenNode {
	return TokenNode.isTokenNode(x);
}
