import type { Document, Postcss, Result, Root, AtRule } from 'postcss';
import type { ImportStatement, Stylesheet} from './statement';
import { isImportStatement } from './statement';
import type { Condition } from './conditions';
import { isValidDataURL } from './data-url';
import { parseStylesheet } from './parse-stylesheet';
import { createRequire, resolveId } from './resolve-id';
import { loadContent } from './load-content';
import noopPlugin from './noop-plugin';
import { IS_CHARSET_REGEX } from './names';

export async function parseStyles(
	result: Result,
	styles: Root | Document,
	importingNode: AtRule | null,
	conditions: Array<Condition>,
	from: Array<string>,
	postcss: Postcss,
): Promise<Stylesheet> {
	const stylesheet = parseStylesheet(result, styles, importingNode, conditions, from);

	{
		// Lazy because the current stylesheet might not contain any further @import statements
		let require: NodeRequire | undefined;
		let sourceFile: string | undefined;
		let base: string | undefined;

		const jobs: Array<Promise<void>> = [];
		for (const stmt of stylesheet.statements) {
			if (!isImportStatement(stmt) || !isProcessableURL(stmt.uri)) {
				continue;
			}

			if (!require || !sourceFile || !base) {
				[require, sourceFile, base] = createRequire(stmt.node, result);
				if (!require || !sourceFile || !base) {
					continue;
				}
			}

			jobs.push(resolveImportId(result, stmt, postcss, require, sourceFile, base));
		}

		if (jobs.length) {
			await Promise.all(jobs);
		}
	}

	for (let i = 0; i < stylesheet.statements.length; i++) {
		const stmt = stylesheet.statements[i];

		if (isImportStatement(stmt) && stmt.stylesheet) {
			if (stylesheet.charset && stmt.stylesheet.charset && stylesheet.charset.params.toLowerCase() !== stmt.stylesheet.charset.params.toLowerCase()) {
				throw stmt.stylesheet.charset.error(
					'Incompatible @charset statements:\n' +
					`  ${stmt.stylesheet.charset.params} specified in ${stmt.stylesheet.charset.source?.input.file}\n` +
					`  ${stylesheet.charset.params} specified in ${stylesheet.charset.source?.input.file}`,
				);
			} else if (!stylesheet.charset && !!stmt.stylesheet.charset) {
				stylesheet.charset = stmt.stylesheet.charset;
			}

			stylesheet.statements.splice(i, 1, ...stmt.stylesheet.statements);
			i--;
			continue;
		}
	}

	return stylesheet;
}

async function resolveImportId(result: Result, stmt: ImportStatement, postcss: Postcss, require: NodeRequire, sourceFile: string, base: string): Promise<void> {
	if (isValidDataURL(stmt.uri)) {
		stmt.stylesheet = await loadImportContent(
			result,
			stmt,
			stmt.uri,
			postcss,
		);

		return;
	} else if (isValidDataURL(stmt.from[stmt.from.length - 1])) {
		// Data urls can't be used as a base url to resolve imports.
		// Skip inlining and warn.
		stmt.stylesheet = { statements: [] };
		result.warn(
			`Unable to import '${stmt.uri}' from a stylesheet that is embedded in a data url`,
			{
				node: stmt.node,
			},
		);
		return;
	}

	const resolved = resolveId(stmt.node, require, stmt.uri, base);

	result.messages.push({
		type: 'dependency',
		plugin: 'postcss-bundler',
		file: resolved,
		parent: sourceFile,
	});

	stmt.stylesheet = await loadImportContent(result, stmt, resolved, postcss);
}

async function loadImportContent(
	result: Result,
	stmt: ImportStatement,
	filename: string,
	postcss: Postcss,
): Promise<Stylesheet> {
	const { conditions, from, node } = stmt;
	if (from.includes(filename)) {
		return { statements: [] };
	}

	let content: string;

	try {
		content = await loadContent(filename);
	} catch {
		throw node.error(
			`Failed to find '${stmt.uri}'`,
		);
	}

	const importedResult = await postcss([noopPlugin()]).process(
		content,
		{
			from: filename,
			parser: result.opts.syntax?.parse ?? result.opts.parser ?? undefined,
		},
	);

	const styles = importedResult.root;
	result.messages = result.messages.concat(importedResult.messages);

	if (styles.first?.type === 'atrule' && IS_CHARSET_REGEX.test(styles.first.name)) {
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

const PROTOCOL_REGEX = /^(?:[a-z]+:)?\/\//i;

function isProcessableURL(uri: string): boolean {
	// skip protocol base uri (protocol://url) or protocol-relative
	if (PROTOCOL_REGEX.test(uri)) {
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
