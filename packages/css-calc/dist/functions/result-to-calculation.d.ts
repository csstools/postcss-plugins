import { CSSToken } from '@csstools/css-tokenizer';
import { FunctionNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
export declare function resultToCalculation(node: FunctionNode, aToken: CSSToken, result: number): Calculation | -1;
