import { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
export declare function solveMax(maxNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1;
