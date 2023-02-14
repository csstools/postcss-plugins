import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
export declare function solveRem(remNodes: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1;
