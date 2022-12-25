import { isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenType, TokenWhitespace } from '../interfaces/token';

export function consumeWhiteSpace(ctx: Context, reader: CodePointReader): TokenWhitespace {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (!isWhitespace(reader.codePointSource[reader.cursor])) {
			break;
		}

		reader.advanceCodePoint();
	}

	return [
		TokenType.Whitespace,
		reader.representationString(),
		reader.representationStart,
		reader.representationEnd,
		undefined,
	];
}
