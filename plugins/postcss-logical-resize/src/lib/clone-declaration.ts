import type { Container, Declaration } from 'postcss';

type DeclarationCacheEntry = {
	length: number,
	keys: Set<string>,
};

const declarationCache = new WeakMap<Container, DeclarationCacheEntry>();

function declarationKey(prop: string, value: string): string {
	return `${prop}\0${value}`;
}

function getDeclarationKeys(parent: Container): Set<string> {
	const nodes = parent.nodes || [];
	let entry = declarationCache.get(parent);

	if (!entry || entry.length !== nodes.length) {
		entry = {
			length: nodes.length,
			keys: new Set<string>(),
		};

		for (const node of nodes) {
			if (node.type === 'decl') {
				entry.keys.add(declarationKey(node.prop, node.value));
			}
		}

		declarationCache.set(parent, entry);
	}

	return entry.keys;
}

export function cloneDeclaration(
	declaration: Declaration,
	value: string,
	prop: string,
): void {
	const parent = declaration.parent;

	if (parent) {
		const keys = getDeclarationKeys(parent);
		const key = declarationKey(prop, value);

		if (keys.has(key)) {
			return;
		}

		// The clone is inserted into the same parent below.
		// Record it now so later declarations in this parent still dedupe
		// against it when the parent length happens to stay the same.
		keys.add(key);
	}

	declaration.before(declaration.clone({ value, prop }));
}
