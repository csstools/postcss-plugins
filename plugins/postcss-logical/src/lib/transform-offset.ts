import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';

export function transformOffset(
	prop: string,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		cloneDeclaration(
			declaration,
			declaration.value,
			prop,
		);

		return true;
	};
}
