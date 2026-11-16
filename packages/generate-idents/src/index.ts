const sourceHashes = new Map<string, string>();

/**
 * A generated dashed ident.
 *
 * Generated names are stable for a given generator namespace and source
 * namespace so that separate builds produce the same output.
 *
 * @param generatorNamespace The namespace of the generator.
 * @param sourceNamespace The namespace of the source. Use `hashFileBasenameAndDir` to derive one from a file path.
 * @param increment A value that distinguishes generated names within the same namespaces.
 */
export function generateUniqueDashedIdent(generatorNamespace: string, sourceNamespace: string, increment: string): string {
	return `--_csstools-${generatorNamespace}-${sourceNamespace}-${increment}`;
}

/**
 * A short, stable hash using the basename and directory of a file path.
 *
 * Only the last two path segments are used, so that names are stable
 * regardless of the absolute location of a project. This intentionally avoids
 * `node:crypto` and `node:path` so that this module can run in a browser
 * bundle.
 *
 * @param sourceNamespace A file path, or `undefined` when there is no source file.
 */
export function hashFileBasenameAndDir(sourceNamespace: string | undefined): string {
	if (!sourceNamespace) {
		return '0';
	}

	const existing = sourceHashes.get(sourceNamespace);
	if (existing) {
		return existing;
	}

	const value = simpleHash(sourceKey(sourceNamespace));

	if (sourceHashes.size > 10_000) {
		sourceHashes.clear();
	}

	sourceHashes.set(sourceNamespace, value);

	return value;
}

function simpleHash(sourceNamespace: string): string {
	let hash = 2166136261;

	for (let i = 0; i < sourceNamespace.length; i++) {
		hash ^= sourceNamespace.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}

	return (hash >>> 0).toString(36);
}

function sourceKey(sourceNamespace: string): string {
	const segments = sourceNamespace.replaceAll('\\', '/').split('/').filter((segment) => segment.length > 0);

	if (segments.length === 0) {
		return '.';
	}

	if (segments.length === 1) {
		return `./${segments[0]}`;
	}

	return segments.slice(-2).join('/');
}
