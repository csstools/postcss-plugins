import type { AtRule, ChildNode, Document, Result, Root, Warning } from 'postcss';
import type { Condition } from './conditions';
import type { Stylesheet, ImportStatement, Statement } from './statement';
import { IS_CHARSET_REGEX, IS_IMPORT_REGEX, IS_LAYER_REGEX } from './names';
import { parseAtImport } from './parse-at-import';

export function parseStylesheet(result: Result, styles: Root | Document, importingNode: AtRule | null, conditions: Array<Condition>, from: Array<string>): Stylesheet {
	const stylesheet: Stylesheet = {
		statements: [],
	};

	if (styles.type === 'document') {
		styles.each((root) => {
			const subStylesheet = parseStylesheet(result, root, importingNode, conditions, from);

			if (stylesheet.charset && subStylesheet.charset && stylesheet.charset.params.toLowerCase() !== subStylesheet.charset.params.toLowerCase()) {
				throw subStylesheet.charset.error(
					'Incompatible @charset statements:\n' +
					`  ${subStylesheet.charset.params} specified in ${subStylesheet.charset.source?.input.file}\n` +
					`  ${stylesheet.charset.params} specified in ${stylesheet.charset.source?.input.file}`,
				);
			} else if (!stylesheet.charset && !!subStylesheet.charset) {
				stylesheet.charset = subStylesheet.charset;
			}

			stylesheet.statements.push(...subStylesheet.statements);
		});

		return stylesheet;
	}

	let charset: AtRule | undefined;
	let beforeImports: Array<Statement> = [];
	let imports: Array<Statement> = [];
	let afterImports: Statement | undefined;

	for (let i = 0; i < styles.nodes.length; i++) {
		const node = styles.nodes[i];

		if (i === 0 && node.type === 'atrule' && IS_CHARSET_REGEX.test(node.name)) {
			charset = node;
			continue;
		}

		if (!imports.length && (node.type === 'comment' || (node.type === 'atrule' && IS_LAYER_REGEX.test(node.name) && !node.nodes))) {
			[i, beforeImports] = consumeBeforeImports(styles.nodes, conditions, i, importingNode, from);
			continue;
		}

		if (!imports.length && node.type === 'atrule' && IS_IMPORT_REGEX.test(node.name)) {
			[i, imports] = consumeImports(result, styles.nodes, conditions, i, importingNode, from);
			continue;
		}

		afterImports = {
			type: 'nodes',
			nodes: styles.nodes.slice(i),
			conditions: [...conditions],
			from,
			importingNode,
		};

		break;
	}

	const statements: Array<Statement> = [];

	if (beforeImports.length) {
		statements.push(...beforeImports);
	}

	if (imports.length) {
		statements.push(...imports);
	}

	if (afterImports) {
		statements.push(afterImports);
	}

	return {
		charset,
		statements,
	};
}

function consumeImports(result: Result, nodes: Array<ChildNode>, conditions: Array<Condition>, cursor: number, importingNode: AtRule | null, from: Array<string>): [number, Array<Statement>] {
	const statements: Array<Statement> = [];

	let i = cursor;
	const l = nodes.length;
	for (i; i < l; i++) {
		const node = nodes[i];
		if (node.type === 'comment') {
			const [j, commentsStmt] = consumeComments(nodes, i, importingNode, from);
			statements.push(commentsStmt);

			i = j;
			continue;
		}

		if (node.type === 'atrule' && IS_IMPORT_REGEX.test(node.name)) {
			statements.push(parseImport(result, node, importingNode, conditions, from));
			continue;
		}

		break;
	}

	return [
		i - 1,
		statements,
	];
}

function consumeBeforeImports(nodes: Array<ChildNode>, conditions: Array<Condition>, cursor: number, importingNode: AtRule | null, from: Array<string>): [number, Array<Statement>] {
	const statements: Array<Statement> = [];

	let i = cursor;
	const l = nodes.length;
	for (i; i < l; i++) {
		const node = nodes[i];
		if (node.type === 'comment') {
			const [j, commentsStmt] = consumeComments(nodes, i, importingNode, from);
			statements.push(commentsStmt);

			i = j;
			continue;
		}

		if (node.type === 'atrule' && IS_LAYER_REGEX.test(node.name) && !node.nodes) {
			if (conditions.length) {
				statements.push({
					type: 'pre-import',
					node: node,
					conditions: [...conditions],
					from,
					importingNode,
				});

				continue;
			} else {

				const [j, layerStmt] = consumeLayers(nodes, conditions, i, importingNode, from);
				statements.push(layerStmt);

				i = j;
				continue;
			}
		}

		break;
	}

	return [
		i - 1,
		statements,
	];
}

function consumeComments(nodes: Array<ChildNode>, cursor: number, importingNode: AtRule | null, from: Array<string>): [number, Statement] {
	const comments: Array<ChildNode> = [];

	let i = cursor;
	const l = nodes.length;
	for (i; i < l; i++) {
		const node = nodes[i];
		comments.push(node);

		const next = nodes[i + 1];
		if (next?.type === 'comment') {
			continue;
		}

		break;
	}

	return [
		i,
		{
			type: 'nodes',
			nodes: comments,
			conditions: [],
			from,
			importingNode,
		},
	];
}

function consumeLayers(nodes: Array<ChildNode>, conditions: Array<Condition>, cursor: number, importingNode: AtRule | null, from: Array<string>): [number, Statement] {
	const layers: Array<ChildNode> = [];

	let i = cursor;
	const l = nodes.length;
	for (i; i < l; i++) {
		const node = nodes[i];
		layers.push(node);

		const next = nodes[i + 1];
		if (next && next.type === 'atrule' && IS_LAYER_REGEX.test(next.name) && !next.nodes) {
			continue;
		}

		break;
	}

	return [
		i,
		{
			type: 'nodes',
			nodes: layers,
			conditions: [...conditions],
			from,
			importingNode,
		},
	];
}

function parseImport(result: Result, atRule: AtRule, importingNode: AtRule | null, conditions: Array<Condition>, from: Array<string>): Warning | ImportStatement {
	const parsed = parseAtImport(atRule.params);
	if (!parsed) {
		return result.warn(`Invalid @import statement in '${atRule.toString()}'`, {
			node: atRule,
		});
	}

	const stmt: ImportStatement = {
		type: 'import',
		uri: parsed.uri,
		fullUri: parsed.fullUri,
		node: atRule,
		conditions: [...conditions],
		from,
		importingNode,
	};

	if (
		typeof parsed.layer !== 'undefined' ||
		typeof parsed.media !== 'undefined' ||
		typeof parsed.supports !== 'undefined' ||
		typeof parsed.scope !== 'undefined'
	) {
		stmt.conditions.push({
			layer: parsed.layer,
			media: parsed.media,
			supports: parsed.supports,
			scope: parsed.scope,
		});
	}

	return stmt;
}
