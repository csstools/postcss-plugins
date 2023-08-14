import type { AtRule, ChildNode, Document, Result, Root, Warning } from 'postcss';
import valueParser from 'postcss-value-parser';
import { Condition } from './conditions';
import { CharsetStatement, ImportStatement, Statement } from './statement';

export function parseStatements(result: Result, styles: Root | Document, conditions: Array<Condition>, from: Array<string>): Array<Statement> {
	const statements: Array<Statement> = [];

	if (styles.type === 'document') {
		styles.each((root) => {
			statements.push(
				...parseStatements(result, root, conditions, from),
			);
		});

		return statements;
	}

	let nodes: Array<ChildNode> = [];

	styles.each(node => {
		let stmt;
		if (node.type === 'atrule') {
			if (node.name === 'import') {
				stmt = parseImport(result, node, conditions, from);
			} else if (node.name === 'charset') {
				stmt = parseCharset(result, node, conditions, from);
			}
		}

		if (stmt) {
			if (nodes.length) {
				statements.push({
					type: 'nodes',
					nodes,
					conditions: [...conditions],
					from,
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
		});
	}

	return statements;
}

function parseCharset(result: Result, atRule: AtRule, conditions: Array<Condition>, from: Array<string>): Warning | CharsetStatement {
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
	};
}

function parseImport(result: Result, atRule: AtRule, conditions: Array<Condition>, from: Array<string>): Warning | ImportStatement {
	let prev = atRule.prev();

	// `@import` statements may follow other `@import` statements.
	while (prev) {
		if (prev.type === 'comment') {
			prev = prev.prev();
			continue;
		}

		if (prev.type === 'atrule' && prev.name === 'import') {
			prev = prev.prev();
			continue;
		}

		break;
	}

	// All `@import` statements may be preceded by `@charset` or `@layer` statements.
	// But the `@import` statements must be consecutive.
	while (prev) {
		if (prev.type === 'comment') {
			prev = prev.prev();
			continue;
		}

		if (prev.type === 'atrule' && prev.name === 'charset') {
			prev = prev.prev();
			continue;
		}

		if (prev.type === 'atrule' && prev.name === 'layer' && !prev.nodes) {
			prev = prev.prev();
			continue;
		}

		return result.warn(
			'@import must precede all other statements (besides @charset or empty @layer)',
			{ node: atRule },
		);
	}

	if (atRule.nodes) {
		return result.warn(
			'It looks like you didn\'t end your @import statement correctly. ' +
			'Child nodes are attached to it.',
			{ node: atRule },
		);
	}

	const params = valueParser(atRule.params).nodes;
	const stmt = {
		type: 'import',
		uri: '',
		fullUri: '',
		node: atRule,
		conditions: [...conditions],
		from,
	};

	let layer: Array<string> = [];
	let media: Array<string> = [];
	let supports: Array<string> = [];

	for (let i = 0; i < params.length; i++) {
		const node = params[i];

		if (node.type === 'space' || node.type === 'comment') {
			continue;
		}

		if (node.type === 'string') {
			if (stmt.uri) {
				return result.warn(`Multiple url's in '${atRule.toString()}'`, {
					node: atRule,
				});
			}

			if (!node.value) {
				return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
					node: atRule,
				});
			}

			stmt.uri = node.value;
			stmt.fullUri = valueParser.stringify(node);
			continue;
		}

		if (node.type === 'function' && /^url$/i.test(node.value)) {
			if (stmt.uri) {
				return result.warn(`Multiple url's in '${atRule.toString()}'`, {
					node: atRule,
				});
			}

			if (!node.nodes?.[0]?.value) {
				return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
					node: atRule,
				});
			}

			stmt.uri = node.nodes[0].value;
			stmt.fullUri = valueParser.stringify(node);
			continue;
		}

		if (!stmt.uri) {
			return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
				node: atRule,
			});
		}

		if (
			(node.type === 'word' || node.type === 'function') &&
			/^layer$/i.test(node.value)
		) {
			if (node.type === 'function' && node.nodes) {
				layer = [valueParser.stringify(node.nodes)];
			} else {
				layer = [''];
			}

			continue;
		}

		if (node.type === 'function' && /^supports$/i.test(node.value)) {
			supports = [valueParser.stringify(node.nodes)];

			continue;
		}

		media = split(params, i);
		break;
	}

	if (!stmt.uri) {
		return result.warn(`Unable to find uri in '${atRule.toString()}'`, {
			node: atRule,
		});
	}

	stmt.uri = stripHash(stmt.uri);

	if (media.length > 0 || layer.length > 0 || supports.length > 0) {
		stmt.conditions.push({
			layer,
			media,
			supports,
		});
	}

	return stmt;
}

function split(params: Array<valueParser.Node>, start: number) {
	const list = [];
	const last = params.reduce((item, node, index) => {
		if (index < start) {
			return '';
		}
		if (node.type === 'div' && node.value === ',') {
			list.push(item);
			return '';
		}
		return item + valueParser.stringify(node);
	}, '');
	list.push(last);
	return list;
}

function stripHash(str: string) {
	try {
		const url = new URL(str, 'http://example.com');
		if (!url.hash) {
			return str;
		}

		return str.slice(0, str.length - url.hash.length);
	} catch {
		return str;
	}
}
