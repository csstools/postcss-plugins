import { FunctionNode, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
export declare function calc(calcNode: FunctionNode | SimpleBlockNode, globals: Map<string, number>): Calculation | -1;
export declare function clamp(clampNode: FunctionNode, globals: Map<string, number>): Calculation | -1;
export declare function max(maxNodes: FunctionNode, globals: Map<string, number>): Calculation | -1;
export declare function min(minNodes: FunctionNode, globals: Map<string, number>): Calculation | -1;
