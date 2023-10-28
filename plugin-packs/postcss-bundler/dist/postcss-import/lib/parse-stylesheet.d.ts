import type { AtRule, Document, Result, Root } from 'postcss';
import { Condition } from './conditions';
import { Stylesheet } from './statement';
export declare function parseStylesheet(result: Result, styles: Root | Document, importingNode: AtRule | null, conditions: Array<Condition>, from: Array<string>): Stylesheet;
