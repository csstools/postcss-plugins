/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TokenTransformOptions } from '../../base/token';
import { toposort } from '../../toposort/toposort';
import { applyTransformsToValue, StyleDictionaryV3TokenValue } from './value';

export function dereferenceTokenValues(tokens: Map<string, StyleDictionaryV3TokenValue>): Map<string, StyleDictionaryV3TokenValue> {
	const tainted = new Set<string>();
	const referenceASTs = new Map<string, Array<ValuePart>>();

	// Gather all references.
	{
		for (const [id, token] of tokens.entries()) {
			const referenceAST = parseReferences(token.value);
			if (!referenceAST.length) {
				continue;
			}

			tainted.add(id);
			referenceASTs.set(id, referenceAST);
		}
	}

	// Fast dereference.
	// Only handles references for which a value can found immediately.
	{
		for (const [id, referenceAST] of referenceASTs.entries()) {
			for (let i = 0; i < referenceAST.length; i++) {
				const reference = referenceAST[i];
				if (reference.type !== 'value-reference') {
					continue;
				}

				if (tainted.has(reference.raw)) {
					continue;
				}

				if (!tokens.has(reference.raw)) {
					throw new Error('Alias "' + reference.raw + '" not found');
				}

				const sourceToken = tokens.get(reference.raw)!;
				referenceAST[i] = {
					type: 'value-resolved',
					raw: reference.raw,
					value: sourceToken.cssValue(),
				};
			}

			const hasFurtherReferences = referenceAST.some(part => part.type === 'value-reference');
			if (hasFurtherReferences) {
				continue;
			}

			const value = (referenceAST as ValuePartsResolved).map(part => part.value).join('');
			const currentToken = tokens.get(id)!;

			currentToken.value = value;
			currentToken.cssValue = (transformOptions: TokenTransformOptions) => {
				return applyTransformsToValue(value, transformOptions);
			};

			tokens.set(id, currentToken);
			tainted.delete(id);
			referenceASTs.delete(id);
		}

		if (tainted.size === 0) {
			return tokens;
		}
	}

	// Topological dereference.
	{
		const nodes : Array<string> = Array.from(tokens.keys());
		const edges: Array<Array<string>> = [];

		for (const [id, referenceAST] of referenceASTs.entries()) {
			for (let i = 0; i < referenceAST.length; i++) {
				const reference = referenceAST[i];
				if (reference.type !== 'value-reference') {
					continue;
				}

				edges.push([reference.raw, id]);
			}
		}

		const sorted = toposort(nodes, edges);
		if (!sorted) {
			throw new Error('Circular reference detected');
		}

		for (const id of sorted) {
			if (!referenceASTs.has(id)) {
				continue;
			}

			const referenceAST = referenceASTs.get(id)!;
			for (let i = 0; i < referenceAST.length; i++) {
				const reference = referenceAST[i];
				if (reference.type !== 'value-reference') {
					continue;
				}

				if (tainted.has(reference.raw)) {
					throw new Error('Alias "' + reference.raw + '" can not be resolved');
				}

				if (!tokens.has(reference.raw)) {
					throw new Error('Alias "' + reference.raw + '" not found');
				}

				const sourceToken = tokens.get(reference.raw)!;
				referenceAST[i] = {
					type: 'value-resolved',
					raw: reference.raw,
					value: sourceToken.cssValue(),
				};
			}

			const hasFurtherReferences = referenceAST.some(part => part.type === 'value-reference');
			if (hasFurtherReferences) {
				throw new Error('Token "' + id + '" can not be fully resolved');
			}

			const value = (referenceAST as ValuePartsResolved).map(part => part.value).join('');
			const currentToken = tokens.get(id)!;

			currentToken.value = value;
			currentToken.cssValue = (transformOptions: TokenTransformOptions) => {
				return applyTransformsToValue(value, transformOptions);
			};

			tokens.set(id, currentToken);
			tainted.delete(id);
			referenceASTs.delete(id);
		}

		if (tainted.size === 0) {
			return tokens;
		}
	}

	return tokens;
}

type ValuePartsResolved = Array<ValueNonReference | ValueResolved>;
type ValuePart = ValueReference | ValueNonReference | ValueResolved;

type ValueReference = {
	type: 'value-reference',
	raw: string,
}

type ValueResolved = {
	type: 'value-resolved',
	raw: string,
	value: string,
}

type ValueNonReference = {
	type: 'value-non-reference',
	value: string,
}

function parseReferences(valueWithReferences: unknown): Array<ValuePart> {
	if (typeof valueWithReferences !== 'string') {
		return [];
	}

	if (valueWithReferences.indexOf('{') === -1) {
		return [];
	}

	const result: Array<ValuePart> = [];
	let hasReferences = false;

	let inReference = false;
	let buf = '';

	for (let index = 0; index < valueWithReferences.length; index++) {
		const char = valueWithReferences[index];

		switch (char) {
			case '{':
				if (inReference) {
					throw new Error('Unexpected "{" in "' + valueWithReferences + '" at ' + index);
				}

				if (buf.length > 0) {
					result.push({
						type: 'value-non-reference',
						value: buf,
					});
					buf = '';
				}

				inReference = true;
				break;
			case '}':
				if (!inReference) {
					throw new Error('Unexpected "}" in "' + valueWithReferences + '" at ' + index);
				}

				if (buf.length === 0) {
					throw new Error('Empty alias "{}" in "' + valueWithReferences + '" at ' + index);
				}

				{
					let reference = buf.trim();
					if (reference.slice(-6) === '.value') {
						reference = reference.slice(0, -6);
					}

					result.push({
						type: 'value-reference',
						raw: reference,
					});
					buf = '';
				}

				hasReferences = true;
				inReference = false;
				break;

			default:
				buf += char;
				break;
		}
	}

	if (inReference) {
		throw new Error('Unexpected end of alias in "' + valueWithReferences + '"');
	}

	if (buf.length > 0) {
		result.push({
			type: 'value-non-reference',
			value: buf,
		});
	}

	if (!hasReferences) {
		return [];
	}

	return result;
}
