import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';

export function parseValueCouple(declaration: Declaration): [string, string] {
	const valuesAST = valueParser(declaration.value);
	const values = valuesAST.nodes.filter((node) => node.type !== 'space');

	if (values.length > 2) {
		const error = `[postcss-logical] Invalid number of values for ${declaration.prop}. Found ${values.length} values, expected 1 or 2.`;
		throw new Error(error);
	}

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

	return [valueA, valueB];
}
