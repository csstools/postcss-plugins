import path from 'node:path';

const HAS_PROTOCOL_REGEX = /^([-_a-z0-9]+:)?\/\//i;

/**
 * Rebase a URL from one directory to another.
 *
 * @param {string} url The URL to rebase.
 * @param {string} fromDir The directory to rebase from.
 * @param {string} fromEntryPointDir The directory of the entry point.
 * @returns {string|false} The rebased URL, or `false` if the URL is absolute.
 */
export function rebase(url, fromDir, fromEntryPointDir) {
	if (url.startsWith('data:')) {
		return false;
	}

	if (HAS_PROTOCOL_REGEX.test(url)) {
		return false;
	}

	if (url.startsWith('/')) {
		return url;
	}

	if (url.startsWith('#')) {
		return url;
	}

	try {
		const x = new URL(url);
		if (x.port || x.protocol) {
			return false;
		}
	} catch {}

	const absPath = path.posix.resolve(
		path.posix.join(fromDir, url),
	);

	return path.posix.relative(fromEntryPointDir, absPath);
}
