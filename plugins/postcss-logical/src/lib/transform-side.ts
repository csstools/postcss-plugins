import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';

export function transformSide(
	prop: string,
	side: string,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		cloneDeclaration(
			declaration,
			declaration.value,
			`${prop}-${side}`,
		);

		return true;
	};
}
