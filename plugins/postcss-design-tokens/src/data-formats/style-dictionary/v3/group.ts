import { Token } from '../../base/token';
import { dereferenceTokenValues } from './dereference';
import { extractStyleDictionaryV3Token, StyleDictionaryV3TokenValue } from './value';

export type StyleDictionaryV3TokenGroup = {
	[key: string]: StyleDictionaryV3TokenGroup | StyleDictionaryV3TokenValue;
}

function extractTokens(node: StyleDictionaryV3TokenGroup, path: Array<string>, filePath: string): Map<string, StyleDictionaryV3TokenValue> {
	const result: Map<string, StyleDictionaryV3TokenValue> = new Map();
	for (const key in node) {
		if (Object.hasOwnProperty.call(node, key)) {
			if (
				node[key] === null ||
				typeof node[key] !== 'object' ||
				Array.isArray(node[key])
			) {
				throw new Error(`Parsing error at "${[...path, key].join('.')}"`);
			}

			const child = Object(node[key]);
			if (!child) {
				throw new Error(`Parsing error at "${[...path, key].join('.')}"`);
			}

			if (typeof child['value'] !== 'undefined') {
				const token = extractStyleDictionaryV3Token(child, key, path, filePath);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				result.set(token.metadata!.path.join('.'), token);
				continue;
			}

			for (const [tokenPath, token] of extractTokens(child, [...path, key], filePath).entries()) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				result.set(tokenPath, token);
				continue;
			}
		}
	}

	return result;
}

export function extractStyleDictionaryV3Tokens(node: StyleDictionaryV3TokenGroup, filePath: string): Map<string, Token> {
	return dereferenceTokenValues(extractTokens(node, [], filePath));
}
