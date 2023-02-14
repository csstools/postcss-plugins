import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
export declare function solveRound(roundNodes: FunctionNode, roundingStrategy: string, a: TokenNode, b: TokenNode): Calculation | -1;
