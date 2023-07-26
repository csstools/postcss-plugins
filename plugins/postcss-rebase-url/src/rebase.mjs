import path from 'path';

const hasProtocol = /^([a-z0-9.+-]+:)?\/\//i;

/**
 * Rebase a URL from one directory to another.
 *
 * @param {string} url The URL to rebase.
 * @param {string} fromDir The directory to rebase from.
 * @param {string} fromEntryPointDir The directory of the entry point.
 * @param {string} toDir The directory to rebase to.
 * @returns {string|false} The rebased URL, or `false` if the URL is absolute.
 */
export function rebase(url, fromDir, fromEntryPointDir, toDir) {
	{
		if (url.startsWith('data:')) {
			return false;
		}

		if (hasProtocol.test(url)) {
			return false;
		}

		try {
			const x = new URL(url);
			if (x.port || x.protocol) {
				return false;
			}
		} catch { } // eslint-disable-line no-empty
	}

	const assetPath = path.resolve(
		path.join(
			fromDir.replace(new RegExp(`^${fromEntryPointDir}`), toDir),
			url,
		),
	);

	return path.normalize(
		path.relative(
			toDir,
			assetPath,
		),
	);
}
