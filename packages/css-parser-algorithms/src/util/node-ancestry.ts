export interface walkable {
	walk(cb: (entry: { node: Array<unknown> | unknown, parent: unknown }, index: number | string) => boolean | void)
}

export function gatherNodeAncestry(node: walkable) {
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
