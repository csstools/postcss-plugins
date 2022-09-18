import { isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { TokenType, TokenWhitespace } from '../interfaces/token';

export function consumeWhiteSpace(reader: CodePointReader, max = -1): TokenWhitespace {
	let current = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (max !== -1 && current === max) {
			return [
				TokenType.Whitespace,
				' ',
				...reader.representation(),
			];
		}

		current++;
		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return [
				TokenType.Whitespace,
				' ',
				...reader.representation(),
			];
		}

		if (isWhitespace(peeked)) {
			break;
		}

		reader.readCodePoint();
	}

	return [
		TokenType.Whitespace,
		' ',
		...reader.representation(),
	];
}
