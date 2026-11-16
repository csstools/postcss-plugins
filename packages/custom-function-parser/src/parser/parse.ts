import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import type { CSSToken, ParseError } from '@csstools/css-tokenizer';
import { tokenize } from '@csstools/css-tokenizer';
import { parseCustomFunction } from './parse-custom-function';
import type { CustomFunction } from '../nodes/custom-function';

/**
 * Parse a `@function` prelude from tokens.
 *
 * Returns `false` when the prelude is invalid.
 * `onParseError` only reports tokenizer and component value parsing errors.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-prelude
 */
export function parseFromTokens(
	tokens: Array<CSSToken>,
	options?: {
		onParseError?: (error: ParseError) => void
	},
): CustomFunction | false {
	let errored = false;

	const componentValues = parseListOfComponentValues(tokens, {
		onParseError: (error) => {
			errored = true;
			options?.onParseError?.(error);
		},
	});

	if (errored) {
		return false;
	}

	return parseCustomFunction(componentValues);
}

/**
 * Parse a `@function` prelude.
 *
 * Returns `false` when the prelude is invalid.
 * `onParseError` only reports tokenizer and component value parsing errors.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-prelude
 */
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
