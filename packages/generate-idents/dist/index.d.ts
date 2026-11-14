/**
 * A generated ident.
 *
 * Generated names are stable for a given generator namespace and source
 * namespace so that separate builds produce the same output.
 */
export declare function generateUniqueIdent(generatorNamespace: string, sourceNamespace: string, increment: string): string;

/**
 * A short, stable hash using the basename and directory of a file path.
 *
 * Only the last two path segments are used, so that names are stable
 * regardless of the absolute location of a project. This intentionally avoids
 * `node:crypto` and `node:path` so that this module can run in a browser
 * bundle.
 */
export declare function hashFileBasenameAndDir(sourceNamespace: string): string;

export { }
