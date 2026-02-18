import type { Declaration } from 'postcss';

export function cloneDeclaration(
	declaration: Declaration,
	value: string,
	prop: string,
): void {
	if (declaration.parent && declaration.parent.some((childNode) => {
		return childNode.type === 'decl' && childNode.prop === prop && childNode.value === value;
	})) {
		return;
	}

	declaration.cloneBefore({ value, prop });
}
