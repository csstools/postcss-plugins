import valuesParser from 'postcss-value-parser';
import { isVarFunction } from './is-var-function';
import { parseOrCached } from './parse-or-cached';
import { removeCyclicReferences, toposort } from './toposort';
import transformValueAST from './transform-value-ast';
import { isInitial } from './is-initial';
import { parseVarFunction } from './parse-var-function';

export function buildCustomPropertiesMap(customProperties: Map<string, string>, inherited: Map<string, valuesParser.ParsedValue>, parsedValuesCache: Map<string, valuesParser.ParsedValue>): Map<string, valuesParser.ParsedValue> {
	if (!customProperties.size) {
		return inherited;
	}

	const out: Map<string, valuesParser.ParsedValue> = new Map(inherited);

	{
		const customPropertyGraph: Array<[string, string]> = [];

		for (const [name, value] of customProperties.entries()) {
			const parsedValue = parseOrCached(value, parsedValuesCache);
			let assuredInvalid = false;

			valuesParser.walk(parsedValue.nodes, (node) => {
				if (!isVarFunction(node)) {
					return;
				}

				const parsed = parseVarFunction(node);
				if (!parsed) {
					return;
				}

				if (
					!parsed.fallback &&
					!customProperties.has(parsed.name.value) &&
					!inherited.has(parsed.name.value)
				) {
					assuredInvalid = true;
					return;
				}

				customPropertyGraph.push([parsed.name.value, name]);
			});

			if (!assuredInvalid) {
				out.set(name, parsedValue);
			}
		}

		removeCyclicReferences(out, customPropertyGraph);
	}

	{
		const customPropertyGraph: Array<[string, string]> = [];

		for (const [name, parsedValue] of out.entries()) {
			valuesParser.walk(parsedValue.nodes, (node) => {
				if (!isVarFunction(node)) {
					return;
				}

				const parsed = parseVarFunction(node);
				if (!parsed) {
					return;
				}

				if (
					!parsed.fallback &&
					!out.has(parsed.name.value)
				) {
					out.delete(name);
					return;
				}

				customPropertyGraph.push([parsed.name.value, name]);
			});
		}

		for (let i = 0; i < customPropertyGraph.length; i++) {
			const [from, to] = customPropertyGraph[i];
			if (!out.has(from) || !out.has(to)) {
				customPropertyGraph.splice(i--, 1);
			}
		}

		const sortedCustomPropertyNames = toposort(Array.from(out.keys()), customPropertyGraph);

		for (const customPropertyName of sortedCustomPropertyNames) {
			const value = out.get(customPropertyName);
			if (!value) {
				continue;
			}

			const transformed = transformValueAST(value, out);
			const parsedValue = parseOrCached(transformed, parsedValuesCache);

			out.set(customPropertyName, parsedValue);
		}
	}

	for (const [name, value] of out.entries()) {
		if (isInitial(value)) {
			out.delete(name);
			continue;
		}
	}

	return out;
}
