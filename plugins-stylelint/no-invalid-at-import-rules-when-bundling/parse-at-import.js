const cssTokenizer = require('@csstools/css-tokenizer');
const parsingAlgorithms = require('@csstools/css-parser-algorithms');

const IS_LAYER = /^layer$/i;
const IS_SUPPORTS = /^supports$/i;
const IS_URL = /^url$/i;

module.exports = function parseAtImport(params) {
	const componentValues = parsingAlgorithms.parseListOfComponentValues(
		cssTokenizer.tokenize({ css: params }),
	);

	let uri = '';
	let layer = [];
	let media = [];
	let supports = [];

	PARSING_LOOP:
	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (parsingAlgorithms.isWhitespaceNode(componentValue) || parsingAlgorithms.isCommentNode(componentValue)) {
			continue;
		}

		if (
			parsingAlgorithms.isTokenNode(componentValue) &&
			(
				componentValue.value[0] === cssTokenizer.TokenType.String ||
				componentValue.value[0] === cssTokenizer.TokenType.URL
			)
		) {
			if (uri) {
				return false;
			}

			uri = componentValue.value[4].value;
			continue;
		}

		if (
			parsingAlgorithms.isFunctionNode(componentValue) &&
			IS_URL.test(componentValue.getName())
		) {
			if (uri) {
				return false;
			}

			for (let j = 0; j < componentValue.value.length; j++) {
				const childComponentValue = componentValue.value[j];
				if (parsingAlgorithms.isWhitespaceNode(childComponentValue) || parsingAlgorithms.isCommentNode(childComponentValue)) {
					continue;
				}

				if (
					parsingAlgorithms.isTokenNode(childComponentValue) &&
					childComponentValue.value[0] === cssTokenizer.TokenType.String
				) {
					uri = componentValue.value[4].value;
					continue PARSING_LOOP;
				}

				return false;
			}
		}

		if (
			parsingAlgorithms.isTokenNode(componentValue) &&
			componentValue.value[0] === cssTokenizer.TokenType.Ident &&
			IS_LAYER.test(componentValue.value[4].value)
		) {
			if (layer.length > 0 || supports.length > 0) {
				return false;
			}

			layer.push('');
			continue;
		}

		if (
			parsingAlgorithms.isFunctionNode(componentValue) &&
			IS_LAYER.test(componentValue.getName())
		) {
			if (layer.length > 0 || supports.length > 0) {
				return false;
			}

			layer.push(parsingAlgorithms.stringify([trim(componentValue.value)]));
			continue;
		}

		if (
			parsingAlgorithms.isFunctionNode(componentValue) &&
			IS_SUPPORTS.test(componentValue.getName())
		) {
			if (supports.length > 0) {
				return false;
			}

			supports.push(parsingAlgorithms.stringify([trim(componentValue.value)]));
			continue;
		}

		const remainder = trim(componentValues.slice(i));
		media.push(parsingAlgorithms.stringify([remainder]));
		break;
	}

	if (!uri) {
		return false;
	}

	return {
		uri,
		layer: layer.length > 0 ? layer[0] : null,
		media: media.length > 0 ? media[0] : null,
		supports: supports.length > 0 ? supports[0] : null,
	};
};

function trim(componentValues) {
	let start = 0;
	let end = componentValues.length;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (parsingAlgorithms.isWhitespaceNode(componentValue) || parsingAlgorithms.isCommentNode(componentValue)) {
			continue;
		}

		start = i;
		break;
	}

	for (let i = componentValues.length - 1; i >= 0; i--) {
		const componentValue = componentValues[i];
		if (parsingAlgorithms.isWhitespaceNode(componentValue) || parsingAlgorithms.isCommentNode(componentValue)) {
			continue;
		}

		end = i + 1;
		break;
	}

	return componentValues.slice(start, end);
}
