import type { Document, Root } from 'postcss';
import { Statement, isCharsetStatement, isImportStatement } from './statement';

export function applyStyles(bundle: Array<Statement>, styles: Root | Document) {
	styles.nodes = [];

	// Strip additional statements.
	bundle.forEach(stmt => {
		if (isCharsetStatement(stmt) || isImportStatement(stmt)) {
			stmt.node.parent = undefined;
			styles.append(stmt.node);
		} else if (stmt.type === 'nodes') {
			stmt.nodes.forEach(node => {
				node.parent = undefined;
				styles.append(node);
			});
		}
	});
}
