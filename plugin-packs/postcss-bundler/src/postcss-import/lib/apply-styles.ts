import type { Document, Root } from 'postcss';
import { Stylesheet, isImportStatement, isNodesStatement } from './statement';

export function applyStyles(stylesheet: Stylesheet, styles: Root | Document): void {
	styles.nodes = [];

	if (stylesheet.charset) {
		stylesheet.charset.parent = undefined;
		styles.append(stylesheet.charset);
	}

	// Strip additional statements.
	stylesheet.statements.forEach((stmt) => {
		if (isImportStatement(stmt)) {
			stmt.node.parent = undefined;
			styles.append(stmt.node);
		} else if (isNodesStatement(stmt)) {
			stmt.nodes.forEach((node) => {
				node.parent = undefined;
				styles.append(node);
			});
		}
	});
}
