import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { parseValueCouple } from '../utils/parse-value-couple';

export function transformOffset(
	prop: string,
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		return cloneDeclaration(
			declaration,
			declaration.value,
			prop,
		);
	};
}

export function transformOffsetShorthand(
	side: [string,string],
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		const [sideA, sideB] = side;
		const [valueA, valueB] = parseValueCouple(declaration);

		return [
			...cloneDeclaration(
				declaration,
				valueA,
				sideA,
			),
			...cloneDeclaration(
				declaration,
				valueB,
				sideB,
			),
		];
	};
}
