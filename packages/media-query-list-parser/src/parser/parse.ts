import { ComponentValueType, parseCommaSeparatedListOfComponentValues, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { tokenizer } from '@csstools/css-tokenizer';
import { parseMediaInParens } from '../nodes/media-in-parens';

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

		for (let i = 0; i < componentValuesList.length; i++) {
			const componentValue = componentValuesList[i];
			if (componentValue.type === ComponentValueType.SimpleBlock) {
				result.push(parseMediaInParens(componentValue as SimpleBlockNode));
			}
		}

		return result;
	});

	return mediaQueryList;
}
