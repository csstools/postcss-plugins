import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';

export function transformSide(
	prop: string,
	side: string,
): (declaration: Declaration) => void {
	return (declaration: Declaration) => {
		cloneDeclaration(
			declaration,
			declaration.value,
			`${prop}-${side}`,
		);
	};
}
