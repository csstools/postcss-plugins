import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';

export function parseValueCouple(declaration: Declaration): [string, string] {
	const valuesAST = valueParser(declaration.value);
	const values = valuesAST.nodes.filter((node) => node.type !== 'space');

	if (values.length > 2 || values.length === 0) {
		const errorMessage = `[postcss-logical] Invalid number of values for ${declaration.prop}. Found ${values.length} values, expected 1 or 2.`;
		throw declaration.error(errorMessage);
	}

	let valueA: string;
	let valueB: string;

	if (values.length === 1) {
		valueA = valueParser.stringify(values[0]);
		valueB = valueA;
	} else {
		valueA = valueParser.stringify(values[0]);
		valueB = valueParser.stringify(values[1]);
	}

	return [valueA, valueB];
}
