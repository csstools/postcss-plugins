import type { Document, Postcss, Result, Root } from 'postcss';
import { Statement } from './statement';
import { Condition } from './conditions';
export declare function parseStyles(result: Result, styles: Root | Document, conditions: Array<Condition>, from: Array<string>, postcss: Postcss): Promise<Statement[]>;
