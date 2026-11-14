import { isFunctionNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import type { CSSToken } from '@csstools/css-tokenizer';
import { isTokenComment, stringify } from '@csstools/css-tokenizer';

/**
 * A `<css-type>` as a syntax string, or `*` when it is omitted.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-prelude
 */
export function getSyntaxString(tokens: Array<CSSToken>): string {
	const meaningfulComponentValues = parseListOfComponentValues(tokens).filter((x) => !isWhiteSpaceOrCommentNode(x));

	if (meaningfulComponentValues.length === 0) {
		return '*';
	}

	if (
		meaningfulComponentValues.length === 1 &&
		isFunctionNode(meaningfulComponentValues[0]) &&
		meaningfulComponentValues[0].getName().toLowerCase() === 'type'
	) {
		return stringify(
			meaningfulComponentValues[0].value
				.flatMap((x) => x.tokens())
				.filter((x) => !isTokenComment(x)),
		).trim();
	}

	return stringify(tokens.filter((x) => !isTokenComment(x))).trim();
}
