import type { Calculation } from '../calculation';
import type { Globals } from '../util/globals';
import { FunctionNode } from '@csstools/css-parser-algorithms';
export declare const mathFunctions: Map<string, typeof abs>;
declare function abs(absNode: FunctionNode, globals: Globals): Calculation | -1;
export {};
