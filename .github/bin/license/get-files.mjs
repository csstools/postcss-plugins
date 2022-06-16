import path from 'path';
import { promises as fsp } from 'fs';

// Recursively find all files in the given directory
// - skip directories
// - skip symlinks
// - do not follow links outside of the start dir
export async function getFiles(dir) {
	dir = path.resolve(dir);
	const dirents = await fsp.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(dirents.map((dirent) => {
		const res = path.resolve(dir, dirent.name);
		if (!res.startsWith(dir)) {
			return [];
		}

		if (dirent.isSymbolicLink()) {
			return [];
		}

		if (dirent.isDirectory()) {
			return getFiles(res);
		}

		return [res];
	}));

	return files.flat();
}
