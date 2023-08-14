import type { Node } from 'postcss';
import fs from 'fs';
import path from 'path';
import module from 'module';

export function resolveId(id: string, base: string, node: Node): string {
	let resolvedPath = '';
	if (id.startsWith('node_modules:')) {
		try {
			const require = module.createRequire(base);

			resolvedPath = require.resolve(id.slice(13));
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
