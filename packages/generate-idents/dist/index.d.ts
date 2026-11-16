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
export declare function generateUniqueDashedIdent(generatorNamespace: string, sourceNamespace: string, increment: string): string;

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
export declare function hashFileBasenameAndDir(sourceNamespace: string | undefined): string;

export { }
