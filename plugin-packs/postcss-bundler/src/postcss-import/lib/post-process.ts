import type { AtRule, AtRuleProps, Root, RootProps } from 'postcss';
import type { ImportStatement, NodesStatement, Stylesheet} from './statement';
import { isImportStatement, isNodesStatement, isPreImportStatement, isWarning } from './statement';

export function postProcess(stylesheet: Stylesheet, atRule: (defaults?: AtRuleProps) => AtRule, root: (defaults?: RootProps) => Root): void {
	let indexOfFirstImport = -1;
	let indexOfLastImport = -1;

	for (let i = 0; i < stylesheet.statements.length; i++) {
		const stmt = stylesheet.statements[i];

		if (isImportStatement(stmt)) {
			if (indexOfFirstImport === -1) {
				indexOfFirstImport = i;
			}

			indexOfLastImport = i;
			continue;
		}
	}

	for (let i = 0; i < stylesheet.statements.length; i++) {
		const stmt = stylesheet.statements[i];

		if (isImportStatement(stmt)) {
			continue;
		}

		if (isWarning(stmt)) {
			continue;
		}

		if (isNodesStatement(stmt) && !stmt.importingNode) {
			continue;
		}

		if (isPreImportStatement(stmt)) {
			if (i < indexOfLastImport) {
				const params = 'data:text/css;base64,' + Buffer.from(stmt.node.toString()).toString('base64');

				const importStmt: ImportStatement = {
					type: 'import',
					uri: params,
					fullUri: '"' + params + '"',
					node: atRule({
						name: 'import',
						params: '"' + params + '"',
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

			continue;
		}

		if (i < indexOfFirstImport && stmt.nodes.every((x) => x.type === 'atrule' && !x.nodes)) {
			continue;
		}

		if (i < indexOfLastImport && (stmt.nodes.every((x) => x.type === 'comment'))) {
			continue;
		}

		if (i < indexOfLastImport) {
			const dummyRoot = root();
			stmt.nodes.forEach((node) => {
				node.parent = undefined;
				dummyRoot.append(node);
			});

			const params = 'data:text/css;base64,' + Buffer.from(dummyRoot.toString()).toString('base64');

			const importStmt: ImportStatement = {
				type: 'import',
				uri: params,
				fullUri: '"' + params + '"',
				node: atRule({
					name: 'import',
					params: '"' + params + '"',
					source: stmt.importingNode?.source ?? stmt.nodes[0]?.source,
				}),
				conditions: stmt.conditions,
				from: stmt.from,
				importingNode: stmt.importingNode,
			};

			stylesheet.statements.splice(i, 1, importStmt);
		}
	}
}
