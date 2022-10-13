import { CSSToken, TokenType, tokenizer } from '@csstools/css-tokenizer';
import { MediaFeatureBoolean } from '../nodes/media-feature-boolean';
import { advanceSimpleBlock } from './advance/advance';
import { consumeBoolean } from './consume/consume-boolean';

type Tokenizer = {
	nextToken: () => CSSToken | undefined,
	endOfFile: () => boolean,
}

export function parse(source: string) {
	const t = tokenizer({ css: source }, {
		commentsAreTokens: true,
		onParseError: (err) => {
			console.warn(err);
			throw new Error(`Unable to parse "${source}"`);
		},
	});

	const tokenBuffer = [];
	while (!t.endOfFile()) {
		tokenBuffer.push(t.nextToken());
	}

	// console.log(tokenBuffer);

	const result = consumeBoolean(tokenBuffer);
	const remainder = result.tokens;
	const node = result.node;
	const tokenSlice = node.tokens;

	console.log(tokenSlice);
	console.log(node.nameIndex);
	console.log(node.tokens[node.nameIndex][4].value);

	console.log(remainder);
}

// function consumeMediaQuery(t: Tokenizer) {
// 	let token = t.nextToken();
// 	if (t.endOfFile()) {
// 		return;
// 	}

// 	while (token[0] === TokenType.Whitespace || token[0] === TokenType.Comment) {
// 		token = t.nextToken();
// 		if (t.endOfFile()) {
// 			return;
// 		}
// 	}

// 	if (token[0] === TokenType.OpenParen) {
// 		return consumeMediaQueryWithoutType(t);
// 	}

// 	if (token[0] !== TokenType.Ident) {
// 		return;
// 	}

// 	if (token[0] === TokenType.Ident && token[4].value.toLowerCase() === 'only') {
// 		return consumeMediaQueryWithType(t);
// 	}

// 	if (token[0] === TokenType.Ident && token[4].value.toLowerCase() === 'not') {
// 		token = t.nextToken();
// 		if (t.endOfFile()) {
// 			return;
// 		}

// 		while (token[0] === TokenType.Whitespace || token[0] === TokenType.Comment) {
// 			token = t.nextToken();
// 			if (t.endOfFile()) {
// 				return;
// 			}
// 		}

// 		if (token[0] === TokenType.Comma) {
// 			return;
// 		}

// 		if (token[0] === TokenType.OpenParen) {
// 			return consumeMediaQueryWithoutType(t);
// 		}

// 		return consumeMediaQueryWithType(t);
// 	}

// 	const modifier = token[]
// }

// function consumeMediaQueryWithoutType(t: Tokenizer) {

// }

// function consumeMediaQueryWithType(t: Tokenizer) {

// }
