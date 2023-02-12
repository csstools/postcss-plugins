import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
export declare function solveClamp(clampNode: FunctionNode, minimum: TokenNode | -1, central: TokenNode | -1, maximum: TokenNode | -1): Calculation | -1;
