import { CommentNode, FunctionNode, SimpleBlockNode, TokenNode, WhitespaceNode } from '../consume/consume-component-block-function';

export function isSimpleBlockNode(x: unknown): x is SimpleBlockNode {
	return SimpleBlockNode.isSimpleBlockNode(x);
}

export function isFunctionNode(x: unknown): x is FunctionNode {
	return FunctionNode.isFunctionNode(x);
}

export function isWhitespaceNode(x: unknown): x is WhitespaceNode {
	return WhitespaceNode.isWhitespaceNode(x);
}

export function isCommentNode(x: unknown): x is CommentNode {
	return CommentNode.isCommentNode(x);
}

export function isTokenNode(x: unknown): x is TokenNode {
	return TokenNode.isTokenNode(x);
}
