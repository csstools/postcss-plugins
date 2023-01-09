import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { parseValueCouple } from '../utils/parse-value-couple';

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

export function transformSideShorthand(
	prop: string,
	side: [string, string],
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const [sideA, sideB] = side;
		const [valueA, valueB] = parseValueCouple(declaration);

		cloneDeclaration(
			declaration,
			valueA,
			`${prop}-${sideA}`,
		);

		cloneDeclaration(
			declaration,
			valueB,
			`${prop}-${sideB}`,
		);

		return true;
	};
}
