import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { parseValueCouple } from '../utils/parse-value-couple';

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

export function transformOffsetShorthand(
	side: [string,string],
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const [sideA, sideB] = side;
		const [valueA, valueB] = parseValueCouple(declaration);

		cloneDeclaration(
			declaration,
			valueA,
			sideA,
		);

		cloneDeclaration(
			declaration,
			valueB,
			sideB,
		);

		return true;
	};
}
