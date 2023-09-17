import type { FunctionNode, Node } from 'postcss-value-parser';
export declare function isVarFunction(node: Node): node is FunctionNode;
export declare const HAS_VAR_FUNCTION: RegExp;
