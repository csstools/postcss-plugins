import type { AtRule, ChildNode, Warning } from 'postcss';
import { Condition } from './conditions';

export type Stylesheet = {
	charset?: AtRule;
	statements: Array<Statement>;
}

export type Statement = ImportStatement | PreImportStatement | NodesStatement | Warning;

export type NodesStatement = {
	type: 'nodes'
	nodes: Array<ChildNode>
	conditions: Array<Condition>
	from: Array<string>

	parent?: Statement

	importingNode: AtRule | null
}

export type ImportStatement = {
	type: 'import'
	uri: string
	fullUri: string
	node: AtRule
	conditions: Array<Condition>
	from: Array<string>

	parent?: Statement
	stylesheet?: Stylesheet

	importingNode: AtRule | null
}

export type PreImportStatement = {
	type: 'pre-import'
	node: ChildNode
	conditions: Array<Condition>
	from: Array<string>

	parent?: Statement

	importingNode: AtRule | null
}

export function isWarning(stmt: Statement): stmt is Warning {
	return stmt.type === 'warning';
}

export function isNodesStatement(stmt: Statement): stmt is NodesStatement {
	return stmt.type === 'nodes';
}

export function isImportStatement(stmt: Statement): stmt is ImportStatement {
	return stmt.type === 'import';
}

export function isPreImportStatement(stmt: Statement): stmt is PreImportStatement {
	return stmt.type === 'pre-import';
}
