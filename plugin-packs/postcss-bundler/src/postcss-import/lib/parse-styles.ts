import path from 'path';
import type { Document, Postcss, Result, Root, AtRule } from 'postcss';
import { CharsetStatement, ImportStatement, Statement, isCharsetStatement, isImportStatement } from './statement';
import { Condition } from './conditions';
import { isValidDataURL } from './data-url';
import { parseStatements } from './parse-statements';
import { resolveId } from './resolve-id';
import { loadContent } from './load-content';
import noopPlugin from './noop-plugin';
import { IS_CHARSET } from './names';

export async function parseStyles(
	result: Result,
	styles: Root | Document,
	importingNode: AtRule | null,
	conditions: Array<Condition>,
	from: Array<string>,
	postcss: Postcss,
) {
	const statements = parseStatements(result, styles, importingNode, conditions, from);

	for (const stmt of statements) {
		if (!isImportStatement(stmt) || !isProcessableURL(stmt.uri)) {
			continue;
		}

		await resolveImportId(result, stmt, postcss);
	}

	let charset: CharsetStatement | null = null;
	const imports: Array<Statement> = [];
	const bundle: Array<Statement> = [];

	function handleCharset(stmt: CharsetStatement) {
		if (!charset) {
			charset = stmt;
		} else if (
			stmt.node.params.toLowerCase() !== charset.node.params.toLowerCase()
		) {
			throw stmt.node.error(
				`Incompatible @charset statements:
  ${stmt.node.params} specified in ${stmt.node.source?.input.file}
  ${charset.node.params} specified in ${charset.node.source?.input.file}`,
			);
		}
	}

	// squash statements and their children
	statements.forEach(stmt => {
		if (isCharsetStatement(stmt)) {
			handleCharset(stmt);
		} else if (isImportStatement(stmt)) {
			if (stmt.children) {
				stmt.children.forEach((child) => {
					if (isImportStatement(child)) {
						imports.push(child);
					} else if (isCharsetStatement(child)) {
						handleCharset(child);
					} else {
						bundle.push(child);
					}
				});
			} else {
				imports.push(stmt);
			}
		} else if (stmt.type === 'nodes') {
			bundle.push(stmt);
		}
	});

	return charset ? [charset, ...imports.concat(bundle)] : imports.concat(bundle);
}

async function resolveImportId(result: Result, stmt: ImportStatement, postcss: Postcss) {
	if (isValidDataURL(stmt.uri)) {
		// eslint-disable-next-line require-atomic-updates
		stmt.children = await loadImportContent(
			result,
			stmt,
			stmt.uri,
			postcss,
		);

		return;
	} else if (isValidDataURL(stmt.from[stmt.from.length - 1])) {
		// Data urls can't be used as a base url to resolve imports.
		// Skip inlining and warn.
		stmt.children = [];
		result.warn(
			`Unable to import '${stmt.uri}' from a stylesheet that is embedded in a data url`,
			{
				node: stmt.node,
			},
		);
		return;
	}

	const atRule = stmt.node;
	let sourceFile: string;
	if (atRule.source?.input?.file) {
		sourceFile = atRule.source.input.file;
	} else {
		stmt.children = [];
		result.warn(
			'The current PostCSS AST Node is lacking a source file reference. This is most likely a bug in a PostCSS plugin.',
			{
				node: stmt.node,
			},
		);
		return;
	}

	const base = path.dirname(sourceFile);
	const resolved = resolveId(stmt.uri, base, atRule);

	result.messages.push({
		type: 'dependency',
		plugin: 'postcss-bundler',
		resolved,
		parent: sourceFile,
	});

	const importedContent = await loadImportContent(result, stmt, resolved, postcss);
	stmt.children = importedContent ?? [];
}

async function loadImportContent(
	result: Result,
	stmt: ImportStatement,
	filename: string,
	postcss: Postcss,
) {
	const { conditions, from, node } = stmt;

	if (from.includes(filename)) {
		return;
	}

	const content = await loadContent(filename);

	const importedResult = await postcss([noopPlugin()]).process(
		content,
		{
			from: filename,
			parser: result.opts.syntax?.parse ?? result.opts.parser ?? undefined,
		},
	);

	const styles = importedResult.root;
	result.messages = result.messages.concat(importedResult.messages);

	if (styles.first?.type === 'atrule' && IS_CHARSET.test(styles.first.name)) {
		styles.first.after(postcss.comment({ text: `${stmt.uri}`, source: node.source }));
	} else {
		styles.prepend(postcss.comment({ text: `${stmt.uri}`, source: node.source }));
	}

	// recursion: import @import from imported file
	return parseStyles(
		result,
		styles,
		node,
		conditions,
		[...from, filename],
		postcss,
	);
}

function isProcessableURL(uri: string): boolean {
	// skip protocol base uri (protocol://url) or protocol-relative
	if (/^(?:[a-z]+:)?\/\//i.test(uri)) {
		return false;
	}

	// check for fragment or query
	try {
		// needs a base to parse properly
		const url = new URL(uri, 'https://example.com');

		if (url.search) {
			return false;
		}
	} catch {
		// Ignore
	}

	return true;
}
