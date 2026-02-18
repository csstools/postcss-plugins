import type { Declaration } from 'postcss';

export function cloneDeclaration(
	declaration: Declaration,
	value: string,
	prop: string,
): void {
	if (declaration.parent && declaration.parent.some((x) => {
		return x.type === 'decl' && x.prop === prop && x.value === value;
	})) {
		return;
	}

	declaration.cloneBefore({ value, prop });
}
