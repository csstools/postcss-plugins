const sourceHashes = new Map<string, string>();

/**
 * A generated custom property name.
 *
 * Generated names are stable for a given source file and namespace so that
 * separate builds produce the same output. They are also recognisable, so
 * that generated properties are never processed a second time.
 *
 * Callers may append another custom property name to the result, which keeps
 * the result a valid custom property name.
 */
export function generatedName(namespace: string, from: string | undefined, suffix: string): string {
	return `--_csstools-${namespace}-${sourceHashFor(from)}-${suffix}`;
}

/**
 * A short, stable hash of the source file.
 *
 * Only the last two path segments are used, so that names are stable
 * regardless of the absolute location of a project. This intentionally avoids
 * `node:crypto` and `node:path` so that this module can run in a browser
 * bundle.
 */
function sourceHashFor(from: string | undefined): string {
	if (!from) {
		return '0';
	}

	const existing = sourceHashes.get(from);
	if (existing) {
		return existing;
	}

	const value = hashSourcePath(from);
	sourceHashes.set(from, value);

	return value;
}

function hashSourcePath(from: string): string {
	let hash = 2166136261;
	const source = sourceKey(from);

	for (let i = 0; i < source.length; i++) {
		hash ^= source.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}

	return (hash >>> 0).toString(36);
}

function sourceKey(from: string): string {
	const segments = from.replaceAll('\\', '/').split('/').filter((segment) => segment.length > 0);

	if (segments.length === 0) {
		return '.';
	}

	if (segments.length === 1) {
		return `./${segments[0]}`;
	}

	return segments.slice(-2).join('/');
}
