import type { AtRule, ChildNode, Warning } from 'postcss';
import { Condition } from './conditions';
export type Statement = ImportStatement | CharsetStatement | NodesStatement | Warning;
export type NodesStatement = {
    type: string;
    nodes: Array<ChildNode>;
    conditions: Array<Condition>;
    from: Array<string>;
    parent?: Statement;
    importingNode: AtRule | null;
};
export type CharsetStatement = {
    type: string;
    node: AtRule;
    conditions: Array<Condition>;
    from: Array<string>;
    parent?: Statement;
    importingNode: AtRule | null;
};
export type ImportStatement = {
    type: string;
    uri: string;
    fullUri: string;
    node: AtRule;
    conditions: Array<Condition>;
    from: Array<string>;
    parent?: Statement;
    children?: Array<Statement>;
    importingNode: AtRule | null;
};
export declare function isWarning(stmt: Statement): stmt is Warning;
export declare function isNodesStatement(stmt: Statement): stmt is NodesStatement;
export declare function isCharsetStatement(stmt: Statement): stmt is CharsetStatement;
export declare function isImportStatement(stmt: Statement): stmt is ImportStatement;
