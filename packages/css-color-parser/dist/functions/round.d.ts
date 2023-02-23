import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
export declare function solveRound(roundNode: FunctionNode, roundingStrategy: string, a: TokenNode, b: TokenNode): Calculation | -1;
