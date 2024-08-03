import { isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import type { CSSToken} from '@csstools/css-tokenizer';
import { tokenizer, ParseError, isTokenComment, isTokenWhitespace, isTokenIdent, isTokenDelim, isTokenWhiteSpaceOrComment } from '@csstools/css-tokenizer';
import { LayerName } from '../nodes/layer-name';

/**
 * Parses an array of {@link https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/docs/css-tokenizer.csstoken.md | CSSTokens} into a list of cascade layer names.
 */
export function parseFromTokens(
	tokens: Array<CSSToken>,
	options?: {
		onParseError?: (error: ParseError) => void
	},
): Array<LayerName> {
	const componentValuesLists = parseCommaSeparatedListOfComponentValues(tokens, {
		onParseError: options?.onParseError,
	});

	const onParseError = options?.onParseError ?? ((): void => {
		// noop;
	});

	// There is no error recovery when parsing layer names.
	// They are either fully valid or fully invalid.

	const genericErrorParseState = [
		'6.4.2. Layer Naming and Nesting',
		'Layer name syntax',
		'<layer-name> = <ident> [ \'.\' <ident> ]*',
	];

	const sourceStart = tokens[0][2];
	const sourceEnd = tokens[tokens.length - 1][3];

	const result: Array<LayerName> = [];

	for (let i = 0; i < componentValuesLists.length; i++) {
		const componentValuesList = componentValuesLists[i];
		for (let j = 0; j < componentValuesList.length; j++) {
			const componentValue = componentValuesList[j];
			if (!isTokenNode(componentValue) && !isCommentNode(componentValue) && !isWhitespaceNode(componentValue)) {
				onParseError(new ParseError(
					`Invalid cascade layer name. Invalid layer name part "${componentValue.toString()}"`,
					sourceStart,
					sourceEnd,
					genericErrorParseState,
				));

				return [];
			}
		}

		const componentValueTokens = componentValuesList.flatMap((x) => x.tokens());

		let inLayerNameSequence = false;
		let sawWhiteSpaceAfterIdent = false;
		let lastToken: CSSToken | null = null;
		for (let j = 0; j < componentValueTokens.length; j++) {
			const token = componentValueTokens[j];
			if (!(
				isTokenWhiteSpaceOrComment(token) ||
				isTokenIdent(token) ||
				(
					isTokenDelim(token) &&
					token[4].value === '.'
				)
			)) {
				onParseError(new ParseError(
					`Invalid cascade layer name. Invalid character "${token[1]}"`,
					sourceStart,
					sourceEnd,
					genericErrorParseState,
				));

				return [];
			}

			if (!inLayerNameSequence) {
				if (isTokenDelim(token)) {
					onParseError(new ParseError(
						'Invalid cascade layer name. Layer names can not start with a dot.',
						sourceStart,
						sourceEnd,
						genericErrorParseState,
					));

					return [];
				}
			}

			if (inLayerNameSequence) {
				if (isTokenWhitespace(token)) {
					sawWhiteSpaceAfterIdent = true;
					continue;
				}

				if (sawWhiteSpaceAfterIdent && isTokenComment(token)) {
					continue;
				}

				if (sawWhiteSpaceAfterIdent) {
					onParseError(new ParseError(
						'Invalid cascade layer name. Encountered unexpected whitespace between layer name parts.',
						sourceStart,
						sourceEnd,
						genericErrorParseState,
					));

					return [];
				}

				if (isTokenIdent(lastToken) && isTokenIdent(token)) {
					onParseError(new ParseError(
						'Invalid cascade layer name. Layer name parts must be separated by dots.',
						sourceStart,
						sourceEnd,
						genericErrorParseState,
					));

					return [];
				}

				if (isTokenDelim(lastToken) && isTokenDelim(token)) {
					onParseError(new ParseError(
						'Invalid cascade layer name. Layer name parts must not be empty.',
						sourceStart,
						sourceEnd,
						genericErrorParseState,
					));

					return [];
				}
			}

			if (isTokenIdent(token)) {
				inLayerNameSequence = true;
			}

			if (isTokenIdent(token) || isTokenDelim(token)) {
				lastToken = token;
			}
		}

		if (!lastToken) {
			onParseError(new ParseError(
				'Invalid cascade layer name. Empty layer name.',
				sourceStart,
				sourceEnd,
				genericErrorParseState,
			));

			return [];
		}

		if (isTokenDelim(lastToken)) {
			onParseError(new ParseError(
				'Invalid cascade layer name. Layer name must not end with a dot.',
				sourceStart,
				sourceEnd,
				genericErrorParseState,
			));

			return [];
		}

		result.push(new LayerName(componentValueTokens));
	}

	return result;
}

export function parse(
	source: string,
	options?: {
		onParseError?: (error: ParseError) => void
	},
): Array<LayerName> {
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

	return parseFromTokens(tokens, options);
}
