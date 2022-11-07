import { isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenType, TokenWhitespace } from '../interfaces/token';

export function consumeWhiteSpace(ctx: Context, reader: CodePointReader, max = -1): TokenWhitespace {
	let current = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (max !== -1 && current === max) {
			return [
				TokenType.Whitespace,
				reader.representationString(),
				...reader.representation(),
				undefined,
			];
		}

		current++;
		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return [
				TokenType.Whitespace,
				reader.representationString(),
				...reader.representation(),
				undefined,
			];
		}

		if (!isWhitespace(peeked)) {
			break;
		}

		reader.readCodePoint();
	}

	return [
		TokenType.Whitespace,
		reader.representationString(),
		...reader.representation(),
		undefined,
	];
}
