import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import valueParser from 'postcss-value-parser';

export function transformSideShorthand(
	prop: string,
	side: [string,string],
): (declaration: Declaration) => void {
	return (declaration: Declaration) => {
		const valuesAST = valueParser(declaration.value);
		const values = valuesAST.nodes.filter((node) => node.type !== 'space');

		if (values.length > 2) {
			const error = `[postcss-logical] Invalid number of values for ${declaration.prop}. Found ${values.length} values, expected 1 or 2.`;
			throw new Error(error);
		}

		const [sideA, sideB] = side;
		let valueA;
		let valueB;

		if (values.length === 1) {
			valueA = values[0].value;
			valueB = values[0].value;
		}

		if (values.length === 2) {
			valueA = values[0].value;
			valueB = values[1].value;
		}

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
	};
}
