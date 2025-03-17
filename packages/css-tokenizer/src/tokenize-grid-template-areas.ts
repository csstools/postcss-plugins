import { CARRIAGE_RETURN, CHARACTER_TABULATION, FORM_FEED, FULL_STOP, LINE_FEED, NULL, REPLACEMENT_CHARACTER, SPACE } from "./code-points/code-points";
import { isIdentCodePoint, isSurrogate, isWhitespace } from "./code-points/ranges";
import type { CodePointReader } from "./interfaces/code-point-reader";
import type { GridTemplateAreasTokenNamedCell, GridTemplateAreasTokenNullCell, GridTemplateAreasTokenTrash } from "./interfaces/token-grid-template-areas";
import { TokenTypeGridTemplateAreas } from "./interfaces/token-grid-template-areas";
import { Reader } from "./reader";

/**
 * Tokenize a CSS string describing grid template areas into a list of tokens.
 */
export function tokenizeGridTemplateAreas(input: { valueOf(): string }): Array<GridTemplateAreasTokenNamedCell | GridTemplateAreasTokenNullCell | GridTemplateAreasTokenTrash> {
	const tokens: Array<GridTemplateAreasTokenNamedCell | GridTemplateAreasTokenNullCell | GridTemplateAreasTokenTrash> = [];
	const reader = new Reader(input.valueOf());

	TOKENIZER_LOOP:
	while (true) {
		reader.resetRepresentation();

		const peeked = reader.source.codePointAt(reader.cursor);
		if (typeof peeked === "undefined") {
			break;
		}

		switch (peeked) {
			case LINE_FEED:
			case CARRIAGE_RETURN:
			case FORM_FEED:
			case CHARACTER_TABULATION:
			case SPACE:
				consumeWhiteSpace(reader);
				continue TOKENIZER_LOOP;

			case FULL_STOP:
				tokens.push(consumeNullCell(reader));
				continue TOKENIZER_LOOP;

			default:
				if (peeked === NULL || isSurrogate(peeked) || isIdentCodePoint(peeked)) {
					tokens.push(consumeNamedCell(reader));
					continue TOKENIZER_LOOP;
				}

				tokens.push(consumeTrash(reader));
				continue TOKENIZER_LOOP;
		}
	}

	return tokens;
}

export function consumeNamedCell(reader: CodePointReader): GridTemplateAreasTokenNamedCell {
	const codePoints: Array<number> = [];

	while (true) {
		const codePoint = reader.source.codePointAt(reader.cursor) ?? -1;
		if (codePoint === NULL || isSurrogate(codePoint)) {
			codePoints.push(REPLACEMENT_CHARACTER);
			reader.advanceCodePoint(1 + +(codePoint > 0xffff));
			continue;
		}

		if (isIdentCodePoint(codePoint)) {
			codePoints.push(codePoint);
			reader.advanceCodePoint(1 + +(codePoint > 0xffff));
			continue;
		}

		break;
	}

	return {
		type: TokenTypeGridTemplateAreas.NamedCell,
		value: String.fromCodePoint(...codePoints),
	}
}

function consumeNullCell(reader: CodePointReader): GridTemplateAreasTokenNullCell {
	while (reader.source.codePointAt(reader.cursor) === FULL_STOP) {
		reader.advanceCodePoint();
	}

	return {
		type: TokenTypeGridTemplateAreas.NullCell,
		value: reader.source.slice(reader.representationStart, reader.representationEnd + 1),
	};
}

function consumeWhiteSpace(reader: CodePointReader): void {
	while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
		reader.advanceCodePoint();
	}
}

export function consumeTrash(reader: CodePointReader): GridTemplateAreasTokenTrash {
	reader.advanceCodePoint();

	TOKENIZER_LOOP:
	while (true) {
		const peeked = reader.source.codePointAt(reader.cursor);
		if (typeof peeked === "undefined") {
			break TOKENIZER_LOOP;
		}

		switch (peeked) {
			case LINE_FEED:
			case CARRIAGE_RETURN:
			case FORM_FEED:
			case CHARACTER_TABULATION:
			case SPACE:
			case FULL_STOP:
			case NULL:
				break TOKENIZER_LOOP;
			default:
				if (isSurrogate(peeked) || isIdentCodePoint(peeked)) {
					break TOKENIZER_LOOP;
				}

				reader.advanceCodePoint();
				continue TOKENIZER_LOOP;
		}
	}

	return {
		type: TokenTypeGridTemplateAreas.Trash,
		value: reader.source.slice(reader.representationStart, reader.representationEnd + 1),
	};
}
