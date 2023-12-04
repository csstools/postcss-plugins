import { CSSToken, tokenizer, ParseError, TokenType, TokenIdent, cloneTokens } from '@csstools/css-tokenizer';
import { CustomMedia } from '../nodes/custom-media';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { parseFromTokens } from './parse';

type Options = {
	preserveInvalidMediaQueries?: boolean,
	onParseError?: (error: ParseError) => void
}

export function parseCustomMediaFromTokens(tokens: Array<CSSToken>, options?: Options): CustomMedia | false {
	let name: Array<CSSToken> = [];
	let remainder = tokens;
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i][0] === TokenType.Comment) {
			continue;
		}
		if (tokens[i][0] === TokenType.Whitespace) {
			continue;
		}

		if (tokens[i][0] === TokenType.Ident) {
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
		if (remainder[i][0] === TokenType.Comment) {
			continue;
		}
		if (remainder[i][0] === TokenType.Whitespace) {
			continue;
		}

		if (remainder[i][0] === TokenType.Ident) {
			const identToken = remainder[i] as TokenIdent;
			const identValue = toLowerCaseAZ(identToken[4].value);
			if (identValue === 'false') {
				continue;
			}

			if (identValue === 'true') {
				continue;
			}
		}

		if (remainder[i][0] === TokenType.EOF) {
			break;
		}

		hasOnlyTrueOrFalse = false;
	}

	if (hasOnlyTrueOrFalse) {
		return new CustomMedia(name, null, remainder);
	}

	return new CustomMedia(name, parseFromTokens(cloneTokens(remainder), options));
}

export function parseCustomMedia(source: string, options?: Options): CustomMedia | false {
	const t = tokenizer({ css: source }, {
		onParseError: options?.onParseError,
	});

	const tokens: Array<CSSToken> = [];

	{
		while (!t.endOfFile()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tokens.push(t.nextToken()!);
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tokens.push(t.nextToken()!); // EOF-token
	}

	return parseCustomMediaFromTokens(tokens, options);
}
