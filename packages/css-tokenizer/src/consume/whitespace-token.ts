import { isWhitespace } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { TokenWhitespace } from '../interfaces/token';
import { TokenType } from '../interfaces/token';

export function consumeWhiteSpace(reader: CodePointReader): TokenWhitespace {
	while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
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
