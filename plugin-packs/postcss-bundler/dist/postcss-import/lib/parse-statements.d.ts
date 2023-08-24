import type { AtRule, Document, Result, Root } from 'postcss';
import { Condition } from './conditions';
import { Statement } from './statement';
export declare function parseStatements(result: Result, styles: Root | Document, importingNode: AtRule | null, conditions: Array<Condition>, from: Array<string>): Array<Statement>;
