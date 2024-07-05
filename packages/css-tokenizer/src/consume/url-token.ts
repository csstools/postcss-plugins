import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { APOSTROPHE, LEFT_PARENTHESIS, QUOTATION_MARK, REVERSE_SOLIDUS, RIGHT_PARENTHESIS } from '../code-points/code-points';
import { isNonPrintableCodePoint, isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { ParseErrorWithToken, ParseErrorMessage } from '../interfaces/error';
import { CSSToken, TokenBadURL, TokenType, TokenURL } from '../interfaces/token';
import { consumeBadURL } from './bad-url';
import { consumeEscapedCodePoint } from './escaped-code-point';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-url-token
export function consumeUrlToken(ctx: Context, reader: CodePointReader): TokenURL|TokenBadURL {
	while (isWhitespace(reader.codePointSource[reader.cursor])) {
		reader.advanceCodePoint();
	}

	let string = '';

	while (true) {
		if (reader.codePointSource[reader.cursor] === undefined) {
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

		if (reader.codePointSource[reader.cursor] === RIGHT_PARENTHESIS) {
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

		if (isWhitespace(reader.codePointSource[reader.cursor])) {
			reader.advanceCodePoint();
			while (isWhitespace(reader.codePointSource[reader.cursor])) {
				reader.advanceCodePoint();
			}

			if (reader.codePointSource[reader.cursor] === undefined) {
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

			if (reader.codePointSource[reader.cursor] === RIGHT_PARENTHESIS) {
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

		if (reader.codePointSource[reader.cursor] === QUOTATION_MARK || reader.codePointSource[reader.cursor] === APOSTROPHE || reader.codePointSource[reader.cursor] === LEFT_PARENTHESIS || isNonPrintableCodePoint(reader.codePointSource[reader.cursor])) {
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

		if (reader.codePointSource[reader.cursor] === REVERSE_SOLIDUS) {
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

		string = string + String.fromCodePoint(reader.codePointSource[reader.cursor]);
		reader.advanceCodePoint();
	}
}
