import type { AtRule, ChildNode, Document, Result, Root, Warning } from 'postcss';
import { Condition } from './conditions';
import { CharsetStatement, ImportStatement, Statement } from './statement';
import { IS_CHARSET, IS_IMPORT, IS_LAYER } from './names';
import { parseAtImport } from './parse-at-import';

export function parseStatements(result: Result, styles: Root | Document, importingNode: AtRule | null, conditions: Array<Condition>, from: Array<string>): Array<Statement> {
	const statements: Array<Statement> = [];

	if (styles.type === 'document') {
		styles.each((root) => {
			statements.push(
				...parseStatements(result, root, importingNode, conditions, from),
			);
		});

		return statements;
	}

	let nodes: Array<ChildNode> = [];

	styles.each(node => {
		let stmt;
		if (node.type === 'atrule') {
			if (IS_IMPORT.test(node.name)) {
				stmt = parseImport(result, node, importingNode, conditions, from);
			} else if (IS_CHARSET.test(node.name)) {
				stmt = parseCharset(result, node, importingNode, conditions, from);
			}
		}

		if (stmt) {
			if (nodes.length) {
				statements.push({
					type: 'nodes',
					nodes,
					conditions: [...conditions],
					from,
					importingNode,
				});
				nodes = [];
			}
			statements.push(stmt);
		} else {
			nodes.push(node);
		}
	});

	if (nodes.length) {
		statements.push({
			type: 'nodes',
			nodes,
			conditions: [...conditions],
			from,
			importingNode,
		});
	}

	return statements;
}

function parseCharset(result: Result, atRule: AtRule, importingNode: AtRule | null, conditions: Array<Condition>, from: Array<string>): Warning | CharsetStatement {
	if (atRule.prev()) {
		return result.warn('@charset must precede all other statements', {
			node: atRule,
		});
	}

	return {
		type: 'charset',
		node: atRule,
		conditions: [...conditions],
		from,
		importingNode,
	};
}

function parseImport(result: Result, atRule: AtRule, importingNode: AtRule | null, conditions: Array<Condition>, from: Array<string>): Warning | ImportStatement {
	let prev = atRule.prev();
	let prevIsImport = false;

	// `@import` statements may follow other `@import` statements.
	while (prev) {
		if (prev.type === 'comment') {
			prev = prev.prev();
			continue;
		}

		if (prev.type === 'atrule' && IS_IMPORT.test(prev.name)) {
			// If the previous rule is an `@import` rule is always valid when that preceding rule is valid.
			// And equally also always invalid when it is invalid.
			prevIsImport = true;
			break;
		}

		break;
	}

	if (!prevIsImport) {
		// All `@import` statements may be preceded by `@charset` or `@layer` statements.
		// But the `@import` statements must be consecutive.
		while (prev) {
			if (
				prev.type === 'comment' ||
				(prev.type === 'atrule' && IS_CHARSET.test(prev.name)) ||
				(prev.type === 'atrule' && IS_LAYER.test(prev.name) && !prev.nodes)
			) {
				prev = prev.prev();
				continue;
			}

			return result.warn(
				'@import must precede all other statements (besides @charset or empty @layer)',
				{ node: atRule },
			);
		}
	}

	if (atRule.nodes) {
		return result.warn(
			'It looks like you didn\'t end your @import statement correctly. ' +
			'Child nodes are attached to it.',
			{ node: atRule },
		);
	}

	const stmt = {
		type: 'import',
		uri: '',
		fullUri: '',
		node: atRule,
		conditions: [...conditions],
		from,
		importingNode,
	};

	const parsed = parseAtImport(atRule.params);
	if (!parsed) {
		return result.warn(`Invalid @import statement in '${atRule.toString()}'`, {
			node: atRule,
		});
	}

	const { layer, media, supports, uri, fullUri } = parsed;

	stmt.uri = uri;
	stmt.fullUri = fullUri;

	if (typeof layer !== 'undefined' || typeof media !== 'undefined' || typeof supports !== 'undefined') {
		stmt.conditions.push({
			layer,
			media,
			supports,
		});
	}

	return stmt;
}
