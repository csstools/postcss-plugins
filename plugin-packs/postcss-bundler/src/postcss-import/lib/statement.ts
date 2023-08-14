import type { AtRule, ChildNode, Warning } from 'postcss';
import { Condition } from './conditions';

export type Statement = ImportStatement | CharsetStatement | NodesStatement | Warning;

export type NodesStatement = {
	type: string
	nodes: Array<ChildNode>
	conditions: Array<Condition>
	from: Array<string>

	parent?: Statement
}

export type CharsetStatement = {
	type: string
	node: AtRule
	conditions: Array<Condition>
	from: Array<string>

	parent?: Statement
}

export type ImportStatement = {
	type: string
	uri: string
	fullUri: string
	node: AtRule
	conditions: Array<Condition>
	from: Array<string>

	parent?: Statement
	children?: Array<Statement>
}

export function isWarning(stmt: Statement): stmt is Warning {
	return stmt.type === 'warning';
}

export function isNodesStatement(stmt: Statement): stmt is NodesStatement {
	return stmt.type === 'nodes';
}

export function isCharsetStatement(stmt: Statement): stmt is CharsetStatement {
	return stmt.type === 'charset';
}

export function isImportStatement(stmt: Statement): stmt is ImportStatement {
	return stmt.type === 'import';
}
