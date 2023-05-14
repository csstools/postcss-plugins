import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import valueParser from 'postcss-value-parser';

export function transformInset(
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		const valuesAST = valueParser(declaration.value);
		const values = valuesAST.nodes.filter((node) => node.type !== 'space' && node.type !== 'comment');
		if (values.length > 4) {
			const errorMessage = `[postcss-logical] Invalid number of values for ${declaration.prop}. Found ${values.length} values, expected up to 4 values.`;
			throw declaration.error(errorMessage);
		}

		let top: string;
		let right: string;
		let bottom: string;
		let left: string;

		if (values.length === 1) {
			top = valueParser.stringify(values[0]);
			right = top;
			bottom = top;
			left = top;
		} else if (values.length === 2) {
			top = valueParser.stringify(values[0]);
			right = valueParser.stringify(values[1]);
			bottom = top;
			left = right;
		} else if (values.length === 3) {
			top = valueParser.stringify(values[0]);
			right = valueParser.stringify(values[1]);
			left = right;
			bottom = valueParser.stringify(values[2]);
		} else if (values.length === 4) {
			top = valueParser.stringify(values[0]);
			right = valueParser.stringify(values[1]);
			bottom = valueParser.stringify(values[2]);
			left = valueParser.stringify(values[3]);
		} else {
			return [];
		}

		return [
			...cloneDeclaration(declaration, top, 'top'),
			...cloneDeclaration(declaration, right, 'right'),
			...cloneDeclaration(declaration, bottom, 'bottom'),
			...cloneDeclaration(declaration, left, 'left'),
		];
	};
}
