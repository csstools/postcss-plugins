import path from 'node:path';
import fs from 'node:fs/promises';

// Recursively find all files in the given directory
// - skip directories
// - skip symlinks
// - do not follow links outside of the start dir
export async function getFiles(dir, recursive = true) {
	dir = path.resolve(dir);
	const dirents = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(dirents.map((dirent) => {
		const res = path.resolve(dir, dirent.name);
		if (!res.startsWith(dir)) {
			return [];
		}

		if (dirent.isSymbolicLink()) {
			return [];
		}

		if (recursive && dirent.isDirectory()) {
			return getFiles(res);
		}

		return [res];
	}));

	return files.flat();
}
