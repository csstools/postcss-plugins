import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import type { CSSToken, ParseError } from '@csstools/css-tokenizer';
import { tokenize } from '@csstools/css-tokenizer';
import { parseCustomFunction } from './parse-custom-function';
import type { CustomFunction } from '../nodes/custom-function';

export function parseFromTokens(
	tokens: Array<CSSToken>,
	options?: {
		onParseError?: (error: ParseError) => void
	},
): CustomFunction | false {
	const componentValues = parseListOfComponentValues(tokens, {
		onParseError: options?.onParseError,
	});

	return parseCustomFunction(componentValues);
}

export function parse(
	source: string,
	options?: {
		onParseError?: (error: ParseError) => void
	},
): CustomFunction | false {
	return parseFromTokens(tokenize({ css: source }, {
		onParseError: options?.onParseError,
	}), options);
}
