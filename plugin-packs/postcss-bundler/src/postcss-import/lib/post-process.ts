import type { AtRule, AtRuleProps } from 'postcss';
import type { ImportStatement, NodesStatement, Stylesheet} from './statement';
import { isImportStatement, isNodesStatement, isPreImportStatement } from './statement';

export function postProcess(stylesheet: Stylesheet, atRule: (defaults?: AtRuleProps) => AtRule): void {
	let indexOfFirstImport = -1;
	let indexOfFirstPreImport = -1;
	let indexOfFirstMeaningfulNode = -1;

	for (let i = 0; i < stylesheet.statements.length; i++) {
		const stmt = stylesheet.statements[i];

		if (isImportStatement(stmt)) {
			indexOfFirstImport = i;
			if (indexOfFirstImport !== -1 && indexOfFirstPreImport !== -1 && indexOfFirstMeaningfulNode !== -1) {
				break;
			}

			continue;
		}

		if (isPreImportStatement(stmt)) {
			indexOfFirstPreImport = i;
			if (indexOfFirstImport !== -1 && indexOfFirstPreImport !== -1 && indexOfFirstMeaningfulNode !== -1) {
				break;
			}

			continue;
		}

		if (isNodesStatement(stmt)) {
			for (let j = 0; j < stmt.nodes.length; j++) {
				const node = stmt.nodes[j];
				if (node.type === 'comment') {
					continue;
				}

				indexOfFirstMeaningfulNode = i;
			}

			if (indexOfFirstImport !== -1 && indexOfFirstPreImport !== -1 && indexOfFirstMeaningfulNode !== -1) {
				break;
			}

			continue;
		}
	}

	if (indexOfFirstPreImport !== -1) {
		for (let i = 0; i < stylesheet.statements.length; i++) {
			const stmt = stylesheet.statements[i];

			if (isPreImportStatement(stmt)) {
				if (
					i < indexOfFirstImport &&
					(
						i < indexOfFirstMeaningfulNode ||
						indexOfFirstMeaningfulNode === -1
					)
				) {
					const params = 'data:text/css;base64,' + Buffer.from(stmt.node.toString()).toString('base64');

					const importStmt: ImportStatement = {
						type: 'import',
						uri: params,
						fullUri: '\'' + params + '\'',
						node: atRule({
							name: 'import',
							params: '\'' + params + '\'',
							source: stmt.node.source,
						}),
						conditions: stmt.conditions,
						from: stmt.from,
						importingNode: stmt.importingNode,
					};

					stylesheet.statements.splice(i, 1, importStmt);
				} else {
					const nodesStmt: NodesStatement = {
						type: 'nodes',
						nodes: [stmt.node],
						conditions: stmt.conditions,
						from: stmt.from,
						importingNode: stmt.importingNode,
					};

					stylesheet.statements.splice(i, 1, nodesStmt);
				}
			}
		}
	}
}
