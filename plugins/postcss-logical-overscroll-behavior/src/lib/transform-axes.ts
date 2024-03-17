import type { Declaration } from 'postcss';

export function transformAxes(declaration: Declaration, isHorizontal: boolean): void {
	const inlineProp = isHorizontal ? '-x' : '-y';
	const blockProp = isHorizontal ? '-y' : '-x';
	const prop = declaration.prop.toLowerCase()
		.replace('-inline', inlineProp)
		.replace('-block', blockProp);

	const value = declaration.value;

	if (declaration.parent?.some((x) => {
		return x.type == 'decl' && x.prop === prop && x.value === value;
	})) {
		return;
	}

	declaration.cloneBefore({
		prop: prop,
		value: value,
	});
	declaration.remove();
}
