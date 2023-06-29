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
			sourceIndices(firstNode)[0],
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
		firstToken[2],
		lastToken[3],
	];
}
