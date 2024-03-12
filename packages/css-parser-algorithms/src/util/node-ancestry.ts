/**
 * AST nodes do not have a `parent` property or method.
 * This makes it harder to traverse the AST upwards.
 * This function builds a `Map<Child, Parent>` that can be used to lookup ancestors of a node.
 *
 * @remarks
 * There is no magic behind this or the map it returns.
 * Mutating the AST will not update the map.
 *
 * Types are erased and any content of the map has type `unknown`.
 * If someone knows a clever way to type this, please let us know.
 *
 * @example
 * ```js
 * const ancestry = gatherNodeAncestry(mediaQuery);
 * mediaQuery.walk((entry) => {
 * 	const node = entry.node; // directly exposed
 * 	const parent = entry.parent; // directly exposed
 * 	const grandParent: unknown = ancestry.get(parent); // lookup
 *
 * 	console.log('node', node);
 * 	console.log('parent', parent);
 * 	console.log('grandParent', grandParent);
 * });
 * ```
 */
export function gatherNodeAncestry(node: { walk(cb: (entry: { node: Array<unknown> | unknown, parent: unknown }, index: number | string) => boolean | void): false | undefined }): Map<unknown, unknown> {
	const ancestry: Map<unknown, unknown> = new Map();

	node.walk((entry) => {
		if (Array.isArray(entry.node)) {
			entry.node.forEach((x) => {
				ancestry.set(x, entry.parent);
			});
		} else {
			ancestry.set(entry.node, entry.parent);
		}
	});

	return ancestry;
}
