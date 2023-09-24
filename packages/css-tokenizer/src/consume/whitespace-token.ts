import { isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { TokenType, TokenWhitespace } from '../interfaces/token';

export function consumeWhiteSpace(reader: CodePointReader): TokenWhitespace {
	while (isWhitespace(reader.codePointSource[reader.cursor])) {
		reader.advanceCodePoint();
	}

	return [
		TokenType.Whitespace,
		reader.source.slice(reader.representationStart, reader.representationEnd + 1),
		reader.representationStart,
		reader.representationEnd,
		undefined,
	];
}
