import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';

export function transformSide(
	declaration: Declaration,
	prop: string,
	side: string,
) : Declaration {
	return cloneDeclaration(declaration, declaration.value, `${prop}-${side}`);
}
