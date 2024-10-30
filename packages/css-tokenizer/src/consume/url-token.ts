import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { APOSTROPHE, LEFT_PARENTHESIS, NULL, QUOTATION_MARK, REPLACEMENT_CHARACTER, REVERSE_SOLIDUS, RIGHT_PARENTHESIS } from '../code-points/code-points';
import { isNonPrintableCodePoint, isSurrogate, isWhitespace } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import { ParseErrorWithToken, ParseErrorMessage } from '../interfaces/error';
import type { CSSToken, TokenBadURL, TokenURL } from '../interfaces/token';
import { TokenType } from '../interfaces/token';
import { consumeBadURL } from './bad-url';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-url-token
export function consumeUrlToken(ctx: Context, reader: CodePointReader): TokenURL|TokenBadURL {
	while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
		reader.advanceCodePoint();
	}

	let string = '';

	while (true) {
		if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
			const token: CSSToken = [
				TokenType.URL,
				reader.source.slice(reader.representationStart, reader.representationEnd + 1),
				reader.representationStart,
				reader.representationEnd,
				{
					value: string,
				},
			];

			ctx.onParseError(new ParseErrorWithToken(
				ParseErrorMessage.UnexpectedEOFInURL,
				reader.representationStart,
				reader.representationEnd,
				[
					'4.3.6. Consume a url token',
					'Unexpected EOF',
				],
				token,
			));

			return token;
		}

		if (reader.source.codePointAt(reader.cursor) === RIGHT_PARENTHESIS) {
			reader.advanceCodePoint();
			return [
				TokenType.URL,
				reader.source.slice(reader.representationStart, reader.representationEnd + 1),
				reader.representationStart,
				reader.representationEnd,
				{
					value: string,
				},
			];
		}

		if (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
			reader.advanceCodePoint();
			while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
				reader.advanceCodePoint();
			}

			if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
				const token: CSSToken = [
					TokenType.URL,
					reader.source.slice(reader.representationStart, reader.representationEnd + 1),
					reader.representationStart,
					reader.representationEnd,
					{
						value: string,
					},
				];

				ctx.onParseError(new ParseErrorWithToken(
					ParseErrorMessage.UnexpectedEOFInURL,
					reader.representationStart,
					reader.representationEnd,
					[
						'4.3.6. Consume a url token',
						'Consume as much whitespace as possible',
						'Unexpected EOF',
					],
					token
				));

				return token;
			}

			if (reader.source.codePointAt(reader.cursor) === RIGHT_PARENTHESIS) {
				reader.advanceCodePoint();
				return [
					TokenType.URL,
					reader.source.slice(reader.representationStart, reader.representationEnd + 1),
					reader.representationStart,
					reader.representationEnd,
					{
						value: string,
					},
				];
			}

			consumeBadURL(ctx, reader);
			return [
				TokenType.BadURL,
				reader.source.slice(reader.representationStart, reader.representationEnd + 1),
				reader.representationStart,
				reader.representationEnd,
				undefined,
			];
		}

		const codePoint = reader.source.codePointAt(reader.cursor);
		if (codePoint === QUOTATION_MARK || codePoint === APOSTROPHE || codePoint === LEFT_PARENTHESIS || isNonPrintableCodePoint(codePoint ?? -1)) {
			consumeBadURL(ctx, reader);

			const token: CSSToken = [
				TokenType.BadURL,
				reader.source.slice(reader.representationStart, reader.representationEnd + 1),
				reader.representationStart,
				reader.representationEnd,
				undefined,
			];

			ctx.onParseError(new ParseErrorWithToken(
				ParseErrorMessage.UnexpectedCharacterInURL,
				reader.representationStart,
				reader.representationEnd,
				[
					'4.3.6. Consume a url token',
					'Unexpected U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE (\'), U+0028 LEFT PARENTHESIS (() or non-printable code point',
				],
				token
			));

			return token;
		}

		if (codePoint === REVERSE_SOLIDUS) {
			if (checkIfTwoCodePointsAreAValidEscape(reader)) {
				reader.advanceCodePoint();
				string = string + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
				continue;
			}

			consumeBadURL(ctx, reader);

			const token: CSSToken = [
				TokenType.BadURL,
				reader.source.slice(reader.representationStart, reader.representationEnd + 1),
				reader.representationStart,
				reader.representationEnd,
				undefined,
			]

			ctx.onParseError(new ParseErrorWithToken(
				ParseErrorMessage.InvalidEscapeSequenceInURL,
				reader.representationStart,
				reader.representationEnd,
				[
					'4.3.6. Consume a url token',
					'U+005C REVERSE SOLIDUS (\\)',
					'The input stream does not start with a valid escape sequence',
				],
				token
			));

			return token;
		}

		if (reader.source.codePointAt(reader.cursor) === NULL || isSurrogate(reader.source.codePointAt(reader.cursor) ?? -1)) {
			string = string + String.fromCodePoint(REPLACEMENT_CHARACTER);
			reader.advanceCodePoint();
			continue;
		}

		string = string + reader.source[reader.cursor];
		reader.advanceCodePoint();
	}
}
