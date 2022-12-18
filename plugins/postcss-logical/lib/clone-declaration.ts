import type { Declaration } from 'postcss';

export function cloneDeclaration(
	declaration: Declaration,
	value: string,
	prop: string,
) : Declaration {
	return declaration.cloneBefore({ value, prop });
}
