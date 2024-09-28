import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { isFunctionNode, isSimpleBlockNode, isTokenNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues, SimpleBlockNode, stringify } from '@csstools/css-parser-algorithms';
import { isTokenIdent, isTokenOpenParen, isTokenString, isTokenURL, tokenize, TokenType } from '@csstools/css-tokenizer';
import { IS_LAYER_REGEX, IS_SCOPE_REGEX, IS_SUPPORTS_REGEX, IS_URL_REGEX } from './names';

export function parseAtImport(params: string): false | { uri: string; fullUri: string; layer?: string; media?: string; supports?: string; scope?: string; } {
	const tokens = tokenize({ css: params });

	// Fast path for common cases:
	if (
		tokens.length === 2 && (
			isTokenString(tokens[0]) ||
			isTokenURL(tokens[0])
		)
	) {
		let uri = tokens[0][4].value;
		uri = stripHash(uri);
		if (!uri) {
			return false;
		}

		return {
			uri,
			fullUri: tokens[0][1],
		};
	}

	const componentValues = parseListOfComponentValues(tokens);

	let uri = '';
	let fullUri = '';
	let layer : string | undefined;
	let media : string | undefined;
	let supports: string | undefined;
	let scope: string | undefined;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		if (
			isTokenNode(componentValue) &&
			(
				isTokenString(componentValue.value) ||
				isTokenURL(componentValue.value)
			)
		) {
			if (uri) {
				return false;
			}

			uri = componentValue.value[4].value;
			fullUri = componentValue.value[1];
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_URL_REGEX.test(componentValue.getName())
		) {
			if (uri) {
				return false;
			}

			for (let j = 0; j < componentValue.value.length; j++) {
				const childComponentValue = componentValue.value[j];
				if (isWhiteSpaceOrCommentNode(childComponentValue)) {
					continue;
				}

				if (
					!uri &&
					isTokenNode(childComponentValue) &&
					isTokenString(childComponentValue.value)
				) {
					uri = childComponentValue.value[4].value;
					fullUri = stringify([[componentValue]]);
					continue;
				}

				return false;
			}

			continue;
		}

		if (!uri) {
			return false;
		}

		if (
			isTokenNode(componentValue) &&
			isTokenIdent(componentValue.value) &&
			IS_LAYER_REGEX.test(componentValue.value[4].value)
		) {
			if (typeof layer !== 'undefined' || typeof supports !== 'undefined') {
				return false;
			}

			layer = '';
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_LAYER_REGEX.test(componentValue.getName())
		) {
			if (typeof layer !== 'undefined' || typeof supports !== 'undefined') {
				return false;
			}

			layer = stringify([componentValue.value]);
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_SUPPORTS_REGEX.test(componentValue.getName())
		) {
			if (typeof supports !== 'undefined') {
				return false;
			}

			supports = stringify([componentValue.value]);
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_SCOPE_REGEX.test(componentValue.getName())
		) {
			if (typeof scope !== 'undefined') {
				return false;
			}

			scope = stringify([wrapInParenthesisIfNeeded(componentValue.value)]);
			continue;
		}

		media = stringify([componentValues.slice(i)]);
		break;
	}

	uri = stripHash(uri);
	if (!uri) {
		return false;
	}

	return {
		uri,
		fullUri,
		layer,
		media,
		supports,
		scope,
	};
}

function wrapInParenthesisIfNeeded(componentValues: Array<ComponentValue>): Array<ComponentValue> {
	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		if (isSimpleBlockNode(componentValue) && isTokenOpenParen(componentValue.startToken)) {
			return componentValues;
		}
	}

	return [
		new SimpleBlockNode(
			[TokenType.OpenParen, '(', -1, -1, undefined],
			[TokenType.CloseParen, ')', -1, -1, undefined],
			componentValues
		)
	];
}

function stripHash(str: string): string {
	if (str.startsWith('#')) {
		return '';
	} else if (!str.includes('#')) {
		return str;
	}

	try {
		const url = new URL(str, 'http://example.com');
		if (!url.hash) {
			return str;
		}

		return str.slice(0, str.length - url.hash.length);
	} catch {
		return str;
	}
}
