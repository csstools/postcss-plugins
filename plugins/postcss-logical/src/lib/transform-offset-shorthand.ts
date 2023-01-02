import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import valueParser from 'postcss-value-parser';

export function transformOffsetShorthand(
	side: [string,string],
): (declaration: Declaration) => boolean {
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
			valueA = valueParser.stringify(values[0]);
			valueB = valueParser.stringify(values[0]);
		}

		if (values.length === 2) {
			valueA = valueParser.stringify(values[0]);
			valueB = valueParser.stringify(values[1]);
		}

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
