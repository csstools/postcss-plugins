import { FunctionNode, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { Globals } from '../util/globals';
export declare function calc(calcNode: FunctionNode | SimpleBlockNode, globals: Globals): Calculation | -1;
export declare function clamp(clampNode: FunctionNode, globals: Globals): Calculation | -1;
export declare function max(maxNode: FunctionNode, globals: Globals): Calculation | -1;
export declare function min(minNode: FunctionNode, globals: Globals): Calculation | -1;
export declare function round(roundNode: FunctionNode, globals: Globals): Calculation | -1;
