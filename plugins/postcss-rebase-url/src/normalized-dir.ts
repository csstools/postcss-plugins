import path from 'path';

/**
 * Returns a posix path for the directory of the given file path.
 *
 * @param {string} x The file path to normalize.
 * @returns {string} The normalized directory path.
 */
export function normalizedDir(x: string): string {
	// Resolve the path to eliminate any relative path components.
	const dir = path.parse(path.resolve(x.trim())).dir;
	// Split the path by the native path separator
	const dirPathComponents = dir.split(path.sep);
	// Join the path components with the posix path separator
	const posixDir = dirPathComponents.join(path.posix.sep);

	return posixDir;
}
