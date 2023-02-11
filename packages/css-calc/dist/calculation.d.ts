import { TokenNode } from '@csstools/css-parser-algorithms';
import { Operation } from './operation/operation';
export type Calculation = {
    inputs: Array<Calculation | TokenNode>;
    operation: Operation;
};
export declare function solve(calculation: Calculation): TokenNode | -1;
