import path from 'path';
import fs from 'fs';
import postcss from 'postcss';

export function parseImport(filePath: string, alreadyImported: Set<string>) {
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

	const fileContents = fs.readFileSync(resolvedPath, 'utf8');
	return postcss.parse(fileContents);
}
