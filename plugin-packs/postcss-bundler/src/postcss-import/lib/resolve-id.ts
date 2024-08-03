import type { Node, Result } from 'postcss';
import path from 'node:path';
import module from 'node:module';

export function resolveId(node: Node, require: NodeRequire, id: string, base: string): string {
	let resolvedPath = '';
	if (id.startsWith('node_modules:')) {
		try {
			resolvedPath = require.resolve(id.slice(13));
		} catch {
			throw node.error(
				`Failed to find '${id}'`,
			);
		}
	} else {
		resolvedPath = path.resolve(base, id);
	}

	return resolvedPath;
}

export function createRequire(node: Node, result: Result): [NodeRequire, string, string] | [] {
	let sourceFile: string;
	if (node.source?.input?.file) {
		sourceFile = node.source.input.file;
	} else {
		result.warn(
			'The current PostCSS AST Node is lacking a source file reference. This is most likely a bug in a PostCSS plugin.',
			{
				node: node,
			},
		);

		return [];
	}

	const base = path.dirname(sourceFile);
	const require = module.createRequire(base);

	return [require, sourceFile, base];
}
