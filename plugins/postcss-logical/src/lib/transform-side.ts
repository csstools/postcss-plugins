import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { parseValueCouple } from '../utils/parse-value-couple';

export function transformSide(
	prop: string,
	side: string,
): (declaration: Declaration) => Array<Declaration>{
	return (declaration: Declaration) => {
		return cloneDeclaration(
			declaration,
			declaration.value,
			`${prop}-${side}`,
		);
	};
}

export function transformSideShorthand(
	prop: string,
	side: [string, string],
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		const [sideA, sideB] = side;
		const [valueA, valueB] = parseValueCouple(declaration);

		return [
			...cloneDeclaration(
				declaration,
				valueA,
				`${prop}-${sideA}`,
			),
			...cloneDeclaration(
				declaration,
				valueB,
				`${prop}-${sideB}`,
			),
		];
	};
}
