import { ComponentValue, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, parseCommaSeparatedListOfComponentValues, parseListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { IS_LAYER, IS_SUPPORTS, IS_URL } from './names';

export function parseAtImport(params: string) {
	const componentValues = parseListOfComponentValues(
		tokenize({ css: params }),
	);

	let uri = '';
	let fullUri = '';
	const layer = [];
	const media = [];
	const supports = [];

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

		if (
			isTokenNode(componentValue) &&
			componentValue.value[0] === TokenType.Ident &&
			IS_LAYER.test(componentValue.value[4].value)
		) {
			if (layer.length > 0 || supports.length > 0) {
				return false;
			}

			layer.push('');
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
			continue;
		}

		const remainder = trim(componentValues.slice(i));
		const remainderTokens = remainder.flatMap(x => x.tokens());
		const list = parseCommaSeparatedListOfComponentValues(remainderTokens);
		const serializedList = list.map((x) => stringify([trim(x)]));
		media.push(...serializedList);
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

function trim(componentValues: Array<ComponentValue>) {
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

function stripHash(str: string) {
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
