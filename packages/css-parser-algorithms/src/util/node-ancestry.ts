export interface walkable<T, U> {
	walk(cb: (entry: { node: Array<T> | T, parent: U }, index: number | string) => boolean | void)
}

export function gatherNodeAncestry<T, U>(node: walkable<T, U>) {
	const ancestry: Map<T, U> = new Map();

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
