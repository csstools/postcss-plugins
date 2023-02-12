import { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
export declare function solveMin(minNode: FunctionNode, solvedNodes: Array<ComponentValue>): Calculation | -1;
