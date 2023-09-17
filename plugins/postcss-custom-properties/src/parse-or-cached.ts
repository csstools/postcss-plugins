import valuesParser from 'postcss-value-parser';

export function parseOrCached(value: string, parsedValuesCache: Map<string, valuesParser.ParsedValue>): valuesParser.ParsedValue {
	let valueAST = parsedValuesCache.get(value);
	if (valueAST) {
		return valueAST;
	}

	valueAST = valuesParser(value);
	parsedValuesCache.set(value, valueAST);

	return valueAST;
}
