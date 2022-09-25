import { TokenType } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer';

export function splitMediaQueryList(tokens: Array<CSSToken>): Array<Array<CSSToken>> {
	let parenDepth = 0;
	let squareDepth = 0;
	let curlyDepth = 0;
	let depth = 0;

	const listItems = [];
	let lastSliceIndex = 0;

	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i][0] === TokenType.OpenParen || tokens[i][0] === TokenType.Function) {
			depth++;
			parenDepth++;
			continue;
		}
		if (tokens[i][0] === TokenType.CloseParen && parenDepth > 0) {
			depth--;
			parenDepth--;
			continue;
		}

		if (tokens[i][0] === TokenType.OpenCurly) {
			depth++;
			curlyDepth++;
			continue;
		}
		if (tokens[i][0] === TokenType.CloseCurly && curlyDepth > 0) {
			depth--;
			curlyDepth--;
			continue;
		}

		if (tokens[i][0] === TokenType.OpenSquare) {
			depth++;
			squareDepth++;
			continue;
		}
		if (tokens[i][0] === TokenType.CloseSquare && squareDepth > 0) {
			depth--;
			squareDepth--;
			continue;
		}

		if (tokens[i][0] === TokenType.Comma && depth === 0) {
			listItems.push(tokens.slice(lastSliceIndex, i));
			lastSliceIndex = i + 1;
			continue;
		}
	}

	if (lastSliceIndex === 0) {
		return [tokens];
	}

	listItems.push(tokens.slice(lastSliceIndex));
	return listItems;
}
