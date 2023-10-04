import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, parseListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { IS_LAYER, IS_SUPPORTS, IS_URL } from './names';

export function parseAtImport(params: string) {
	const componentValues = parseListOfComponentValues(
		tokenize({ css: params }),
	);

	let uri = '';
	let fullUri = '';
	let layer : string | undefined;
	let media : string | undefined;
	let supports : string | undefined;

	PARSING_LOOP:
	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (isWhitespaceNode(componentValue) || isCommentNode(componentValue)) {
			continue;
		}

		if (
			isTokenNode(componentValue) &&
			(
				componentValue.value[0] === TokenType.String ||
				componentValue.value[0] === TokenType.URL
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
			IS_URL.test(componentValue.getName())
		) {
			if (uri) {
				return false;
			}

			for (let j = 0; j < componentValue.value.length; j++) {
				const childComponentValue = componentValue.value[j];
				if (isWhitespaceNode(childComponentValue) || isCommentNode(childComponentValue)) {
					continue;
				}

				if (
					isTokenNode(childComponentValue) &&
					childComponentValue.value[0] === TokenType.String
				) {
					uri = childComponentValue.value[4].value;
					fullUri = stringify([[componentValue]]);
					continue PARSING_LOOP;
				}

				return false;
			}
		}

		if (!uri) {
			return false;
		}

		if (
			isTokenNode(componentValue) &&
			componentValue.value[0] === TokenType.Ident &&
			IS_LAYER.test(componentValue.value[4].value)
		) {
			if (typeof layer !== 'undefined' || typeof supports !== 'undefined') {
				return false;
			}

			layer = '';
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_LAYER.test(componentValue.getName())
		) {
			if (typeof layer !== 'undefined' || typeof supports !== 'undefined') {
				return false;
			}

			layer = stringify([componentValue.value]).trim();
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_SUPPORTS.test(componentValue.getName())
		) {
			if (typeof supports !== 'undefined') {
				return false;
			}

			supports = stringify([componentValue.value]).trim();
			continue;
		}

		media = stringify([componentValues.slice(i)]).trim();
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
	};
}

function stripHash(str: string) {
	if (str.startsWith('#')) {
		return '';
	}

	if (!str.includes('#')) {
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
