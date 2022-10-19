import { ComponentValue, parseCommaSeparatedListOfComponentValues, TokenNode } from '@csstools/css-parser-algorithms';
import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import { GeneralEnclosed } from '../nodes/general-enclosed';

export function parse(source: string) {
	const onParseError = (err) => {
		console.warn(err);
		throw new Error(`Unable to parse "${source}"`);
	};
	const t = tokenizer({ css: source }, {
		commentsAreTokens: true,
		onParseError: onParseError,
	});

	const tokens = [];

	{
		while (!t.endOfFile()) {
			tokens.push(t.nextToken());
		}

		tokens.push(t.nextToken()); // EOF-token
	}

	const parsed = parseCommaSeparatedListOfComponentValues(tokens, {
		onParseError: onParseError,
	});

	const mediaQueryList = parsed.map((componentValuesList) => {
		const result = [];

		const lastSliceIndex = 0;
		for (let i = 0; i < componentValuesList.length; i++) {
			const componentValue = componentValuesList[i];
			if (componentValue.type === 'whitespace' || componentValue.type === 'comment') {
				continue;
			}

			if (componentValue.type === 'function') {
				result.push(new GeneralEnclosed(componentValue));
			}
		}

	});

	return mediaQueryList;
}

function consumeMediaQueryWithType(componentValuesList: Array<ComponentValue>) {
	const modifier: Array<CSSToken> = [];
	const mediaType: Array<CSSToken> = [];

	const lastSliceIndex = 0;
	for (let i = 0; i < componentValuesList.length; i++) {
		const componentValue = componentValuesList[i];
		if (componentValue.type === 'whitespace' || componentValue.type === 'comment') {
			continue;
		}

		if (componentValue.type === 'token') {
			const token = (componentValue as TokenNode).value;

			switch (token[0]) {
				case TokenType.Ident:

					break;

				default:
					break;
			}
		}
	}
}
