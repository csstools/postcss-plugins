import type { CSSToken, ParseError, TokenIdent} from '@csstools/css-tokenizer';
import { tokenize, cloneTokens, isTokenWhiteSpaceOrComment, isTokenIdent, isTokenEOF } from '@csstools/css-tokenizer';
import { CustomMedia } from '../nodes/custom-media';
import { parseFromTokens } from './parse';

export function parseCustomMediaFromTokens(
	tokens: Array<CSSToken>,
	options?: {
		preserveInvalidMediaQueries?: boolean,
		onParseError?: (error: ParseError) => void
	},
): CustomMedia | false {
	let name: Array<CSSToken> = [];
	let remainder = tokens;
	for (let i = 0; i < tokens.length; i++) {
		if (isTokenWhiteSpaceOrComment(tokens[i])) {
			continue;
		}

		if (isTokenIdent(tokens[i])) {
			const identToken = tokens[i] as TokenIdent;
			if (identToken[4].value.startsWith('--')) {
				name = tokens.slice(0, i + 1);
				remainder = tokens.slice(i + 1);
				break;
			}
		}

		return false;
	}

	let hasOnlyTrueOrFalse = true;
	for (let i = 0; i < remainder.length; i++) {
		if (isTokenWhiteSpaceOrComment(remainder[i])) {
			continue;
		}

		if (isTokenIdent(remainder[i])) {
			const identToken = remainder[i] as TokenIdent;
			const identValue = identToken[4].value.toLowerCase();
			if (identValue === 'false') {
				continue;
			}

			if (identValue === 'true') {
				continue;
			}
		}

		if (isTokenEOF(remainder[i])) {
			break;
		}

		hasOnlyTrueOrFalse = false;
	}

	if (hasOnlyTrueOrFalse) {
		return new CustomMedia(name, null, remainder);
	}

	return new CustomMedia(name, parseFromTokens(cloneTokens(remainder), options));
}

export function parseCustomMedia(
	source: string,
	options?: {
		preserveInvalidMediaQueries?: boolean,
		onParseError?: (error: ParseError) => void
	},
): CustomMedia | false {
	return parseCustomMediaFromTokens(tokenize({ css: source }, {
		onParseError: options?.onParseError,
	}), options);
}
