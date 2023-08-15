import type { Document, Postcss, Result, Root, AtRule } from 'postcss';
import { Statement } from './statement';
import { Condition } from './conditions';
export declare function parseStyles(result: Result, styles: Root | Document, importingNode: AtRule | null, conditions: Array<Condition>, from: Array<string>, postcss: Postcss): Promise<Statement[]>;
