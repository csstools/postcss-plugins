import path from 'path';
import fs from 'fs';
import type { Helpers, Root } from 'postcss';
import module from 'module';

const require = module.createRequire(import.meta.url);

export function parseImport(root: Root, postcssHelpers: Helpers, filePath: string, alreadyImported: Set<string>) {
	let resolvedPath = '';

	if (filePath.startsWith('node_modules://')) {
		try {
			resolvedPath = require.resolve(filePath.slice(15), {
				paths: [
					path.dirname(filePath),
				],
			});
		} catch (e) {
			throw new Error(`Failed to read ${filePath} with error ${(e as Error).message}`);
		}
	} else {
		resolvedPath = path.resolve(filePath);
	}

	if (alreadyImported.has(resolvedPath)) {
		return false;
	}

	alreadyImported.add(resolvedPath);

	postcssHelpers.result.messages.push({
		type: 'dependency',
		plugin: 'postcss-global-data',
		file: resolvedPath,
		parent: root.source?.input?.file,
	});

	const fileContents = fs.readFileSync(resolvedPath, 'utf8');
	return postcssHelpers.postcss.parse(fileContents, { from: resolvedPath });
}
