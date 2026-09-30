import path from 'node:path';
import fs from 'node:fs';
import type { Helpers, Root } from 'postcss';
import module from 'node:module';

export function parseImport(root: Root, postcssHelpers: Helpers, filePath: string, alreadyImported: Set<string>): Root|false {
	let resolvedPath;

	try {
		if (filePath.startsWith('node_modules://')) {
			const require = module.createRequire(process.cwd());

			resolvedPath = require.resolve(filePath.slice(15));
		} else if (filePath.startsWith('node_modules:')) {
			const require = module.createRequire(process.cwd());

			resolvedPath = require.resolve(filePath.slice(13));
		} else {
			resolvedPath = path.resolve(filePath);
		}
	} catch (err) {
		throw new Error(`Failed to read ${filePath} with error ${(err instanceof Error) ? err.message : err}`, {
			cause: err
		});
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
