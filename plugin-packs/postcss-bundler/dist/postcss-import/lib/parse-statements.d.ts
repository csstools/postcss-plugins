import type { Document, Result, Root } from 'postcss';
import { Condition } from './conditions';
import { Statement } from './statement';
export declare function parseStatements(result: Result, styles: Root | Document, conditions: Array<Condition>, from: Array<string>): Array<Statement>;
