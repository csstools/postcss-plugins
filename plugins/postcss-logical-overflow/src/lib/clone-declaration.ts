import type { Declaration } from 'postcss';

export function cloneDeclaration(
	declaration: Declaration,
	value: string,
	prop: string,
): Array<Declaration> {
	if (declaration.parent && declaration.parent.some((x) => {
		return x.type == 'decl' && x.prop === prop && x.value === value;
	})) {
		return [];
	}

	return [declaration.clone({ value, prop })];
}
