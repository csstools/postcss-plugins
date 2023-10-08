const parserAlgorithms = require('@csstools/css-parser-algorithms');
const tokenizer = require('@csstools/css-tokenizer');

const { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, parseCommaSeparatedListOfComponentValues, parseListOfComponentValues, stringify, sourceIndices } = parserAlgorithms;
const { TokenType, tokenize } = tokenizer;

const IS_LAYER = /^layer$/i;
const IS_SUPPORTS = /^supports$/i;
const IS_URL = /^url$/i;

module.exports = function parseAtImport(params) {
	const componentValues = parseListOfComponentValues(
		tokenize({ css: params }),
	);

	let uri = '';
	let uriSourceIndices;
	let fullUri = '';
	const layer = [];
	let layerSourceIndices = [];
	const media = [];
	let mediaSourceIndices = [];
	const supports = [];
	let supportsSourceIndices = [];

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
					isTokenNode(childComponentValue) &&
					childComponentValue.value[0] === TokenType.String
				) {
					uri = childComponentValue.value[4].value;
					fullUri = stringify([[componentValue]]);
					uriSourceIndices = sourceIndices(componentValue);
					continue PARSING_LOOP;
				}

				return false;
			}
		}

		if (
			isTokenNode(componentValue) &&
			componentValue.value[0] === TokenType.Ident &&
			IS_LAYER.test(componentValue.value[4].value)
		) {
			if (layer.length > 0 || supports.length > 0) {
				return false;
			}

			layer.push('');
			layerSourceIndices = sourceIndices(componentValue);
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_LAYER.test(componentValue.getName())
		) {
			if (layer.length > 0 || supports.length > 0) {
				return false;
			}

			layer.push(stringify([trim(componentValue.value)]));
			layerSourceIndices = sourceIndices(componentValue);
			continue;
		}

		if (
			isFunctionNode(componentValue) &&
			IS_SUPPORTS.test(componentValue.getName())
		) {
			if (supports.length > 0) {
				return false;
			}

			supports.push(stringify([trim(componentValue.value)]));
			supportsSourceIndices = sourceIndices(componentValue);
			continue;
		}

		const remainder = trim(componentValues.slice(i));
		const remainderTokens = remainder.flatMap(x => x.tokens());
		const list = parseCommaSeparatedListOfComponentValues(remainderTokens);
		const serializedList = list.map((x) => stringify([trim(x)]));
		media.push(...serializedList);
		mediaSourceIndices = sourceIndices(remainder);
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
};

function trim(componentValues) {
	let start = 0;
	let end = componentValues.length;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (isWhitespaceNode(componentValue) || isCommentNode(componentValue)) {
			continue;
		}

		start = i;
		break;
	}

	for (let i = componentValues.length - 1; i >= 0; i--) {
		const componentValue = componentValues[i];
		if (isWhitespaceNode(componentValue) || isCommentNode(componentValue)) {
			continue;
		}

		end = i + 1;
		break;
	}

	return componentValues.slice(start, end);
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
