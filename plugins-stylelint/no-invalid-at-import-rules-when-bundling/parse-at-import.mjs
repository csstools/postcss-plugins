import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, parseListOfComponentValues, stringify, sourceIndices, isWhiteSpaceOrCommentNode } from '@csstools/css-parser-algorithms';
import { TokenType, tokenize } from '@csstools/css-tokenizer';

const IS_LAYER = /^layer$/i;
const IS_SUPPORTS = /^supports$/i;
const IS_URL = /^url$/i;

export function parseAtImport(params) {
	const componentValues = parseListOfComponentValues(
		tokenize({ css: params }),
	);

	let uri = '';
	let uriSourceIndices;
	let fullUri = '';
	let layer;
	let layerSourceIndices = [];
	let media;
	let mediaSourceIndices = [];
	let supports;
	let supportsSourceIndices = [];

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
			uriSourceIndices = sourceIndices(componentValue);
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
					!uri &&
					isTokenNode(childComponentValue) &&
					childComponentValue.value[0] === TokenType.String
				) {
					uri = childComponentValue.value[4].value;
					fullUri = stringify([[componentValue]]);
					uriSourceIndices = sourceIndices(componentValue);
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
			componentValue.value[0] === TokenType.Ident &&
			IS_LAYER.test(componentValue.value[4].value)
		) {
			if (typeof layer !== 'undefined' || typeof supports !== 'undefined') {
				return false;
			}

			layer = '';
			layerSourceIndices = sourceIndices(componentValue);
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_LAYER.test(componentValue.getName())
		) {
			if (typeof layer !== 'undefined' || typeof supports !== 'undefined') {
				return false;
			}

			if (!componentValue.value.some((x) => !isWhiteSpaceOrCommentNode(x))) {
				return false;
			}

			layer = stringify([componentValue.value]);
			layerSourceIndices = sourceIndices(componentValue);
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_SUPPORTS.test(componentValue.getName())
		) {
			if (typeof supports !== 'undefined') {
				return false;
			}

			supports = stringify([componentValue.value]);
			supportsSourceIndices = sourceIndices(componentValue);
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
		uriSourceIndices,
		fullUri,
		layer,
		layerSourceIndices,
		media,
		mediaSourceIndices,
		supports,
		supportsSourceIndices,
	};
}

function stripHash(str) {
	if (str.startsWith('#')) {
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
