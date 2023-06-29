import { CSSToken } from '@csstools/css-tokenizer';

interface TokenConvertible {
	tokens(): Array<CSSToken>
}

/**
 * Returns the start and end index of a node in the CSS source string.
 */
export function sourceIndices(x: TokenConvertible | Array<TokenConvertible>): [number, number] {
	if (Array.isArray(x)) {
		const firstNode = x[0];

		if (!firstNode) {
			return [0, 0];
		}

		const lastNode = x[x.length - 1] || firstNode;

		return [
			// start index of the first node
			sourceIndices(firstNode)[0],
			// end index of the last node
			sourceIndices(lastNode)[1],
		];
	}

	const tokens = x.tokens();

	const firstToken = tokens[0];
	const lastToken = tokens[tokens.length - 1];

	if (!firstToken || !lastToken) {
		return [0, 0];
	}

	return [
		// CSSTokens have this layout : [type, raw, start, end]
		// start index of the first token
		firstToken[2],
		// end index of the last token
		lastToken[3],
	];
}
