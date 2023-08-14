import type { Node } from 'postcss';
import fs from 'fs';
import path from 'path';
import module from 'module';

const require = module.createRequire(import.meta.url);

export function resolveId(id: string, base: string, node: Node): string {
	let resolvedPath = '';
	if (id.startsWith('node_modules://')) {
		try {
			resolvedPath = require.resolve(id.slice(15), {
				paths: [base],
			});
		} catch (e) {
			throw node.error(
				`Failed to find '${id}'`,
			);
		}
	} else {
		resolvedPath = path.resolve(base, id);
	}

	if (!fs.existsSync(resolvedPath)) {
		throw node.error(
			`Failed to find '${id}'`,
		);
	}

	return resolvedPath;
}
