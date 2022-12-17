import { isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { ParserError } from '@csstools/css-parser-algorithms/dist/interfaces/error';
import { CSSToken, tokenizer, TokenType } from '@csstools/css-tokenizer';
import { LayerName } from '../nodes/layer-name';

export type Options = {
	onParseError?: (error: ParserError) => void
}

export function parseFromTokens(tokens: Array<CSSToken>, options?: Options) {
	const componentValuesLists = parseCommaSeparatedListOfComponentValues(tokens, {
		onParseError: options?.onParseError,
	});

	const onParseError = options?.onParseError ?? (() => {
		// noop;
	});

	// There is no error recovery when parsing layer names.
	// They are either fully valid or fully invalid.

	const genericError = (message) => {
		return {
			message: `Invalid cascade layer name. ${message}`,
			start: tokens[0][2],
			end: tokens[tokens.length - 1][3],
			state: [
				'6.4.2. Layer Naming and Nesting',
				'Layer name syntax',
				'<layer-name> = <ident> [ \'.\' <ident> ]*',
			],
		};
	};

	const result: Array<LayerName> = [];

	for (let i = 0; i < componentValuesLists.length; i++) {
		const componentValuesList = componentValuesLists[i];
		for (let j = 0; j < componentValuesList.length; j++) {
			const componentValue = componentValuesList[j];
			if (!isTokenNode(componentValue) && !isCommentNode(componentValue) && !isWhitespaceNode(componentValue)) {
				onParseError(genericError(`Invalid layer name part "${componentValue.toString()}"`));
				return [];
			}
		}

		const componentValueTokens = componentValuesList.flatMap((x) => x.tokens());

		let inLayerNameSequence = false;
		let sawWhiteSpaceAfterIdent = false;
		let lastToken: CSSToken;
		for (let j = 0; j < componentValueTokens.length; j++) {
			const token = componentValueTokens[j];
			if (!(
				token[0] === TokenType.Comment ||
				token[0] === TokenType.Whitespace ||
				token[0] === TokenType.Ident ||
				(
					token[0] === TokenType.Delim &&
					token[4].value === '.'
				)
			)) {
				onParseError(genericError(`Invalid character "${token[1]}"`));
				return [];
			}

			if (!inLayerNameSequence) {
				if (token[0] === TokenType.Delim) {
					onParseError(genericError('Layer names can not start with a dot.'));
					return [];
				}
			}

			if (inLayerNameSequence) {
				if (token[0] === TokenType.Whitespace) {
					sawWhiteSpaceAfterIdent = true;
					continue;
				}

				if (sawWhiteSpaceAfterIdent) {
					onParseError(genericError('Encountered unexpected whitespace between layer name parts.'));
					return [];
				}

				if (lastToken[0] === TokenType.Ident) {
					if (token[0] === TokenType.Ident) {
						onParseError(genericError('Layer name parts must be separated by dots.'));
						return [];
					}
				}

				if (lastToken[0] === TokenType.Delim) {
					if (token[0] === TokenType.Delim) {
						onParseError(genericError('Layer name parts must not be empty.'));
						return [];
					}
				}
			}

			if (token[0] === TokenType.Ident) {
				inLayerNameSequence = true;
			}

			if (token[0] === TokenType.Ident || token[0] === TokenType.Delim) {
				lastToken = token;
			}
		}

		if (!lastToken) {
			onParseError(genericError('Empty layer name.'));
			return [];
		}

		if (lastToken[0] === TokenType.Delim) {
			onParseError(genericError('Layer name must not end with a dot.'));
			return [];
		}

		result.push(new LayerName(componentValueTokens));
	}

	return result;
}

export function parse(source: string, options?: Options) {
	const t = tokenizer({ css: source }, {
		commentsAreTokens: true,
		onParseError: options?.onParseError,
	});

	const tokens = [];

	{
		while (!t.endOfFile()) {
			tokens.push(t.nextToken());
		}

		tokens.push(t.nextToken()); // EOF-token
	}

	return parseFromTokens(tokens, options);
}
