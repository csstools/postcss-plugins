import { CommentNode, FunctionNode, SimpleBlockNode, TokenNode, UnclosedFunctionNode, UnclosedSimpleBlockNode, WhitespaceNode } from '../consume/consume-component-block-function';
export declare function isSimpleBlockNode(x: unknown): x is SimpleBlockNode;
export declare function isFunctionNode(x: unknown): x is FunctionNode;
export declare function isUnclosedSimpleBlockNode(x: unknown): x is UnclosedSimpleBlockNode;
export declare function isUnclosedFunctionNode(x: unknown): x is UnclosedFunctionNode;
export declare function isWhitespaceNode(x: unknown): x is WhitespaceNode;
export declare function isCommentNode(x: unknown): x is CommentNode;
export declare function isTokenNode(x: unknown): x is TokenNode;
