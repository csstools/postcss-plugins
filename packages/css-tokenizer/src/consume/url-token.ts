import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { APOSTROPHE, LEFT_PARENTHESIS, QUOTATION_MARK, REVERSE_SOLIDUS, RIGHT_PARENTHESIS } from '../code-points/code-points';
import { isNonPrintableCodePoint, isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenBadURL, TokenType, TokenURL } from '../interfaces/token';
import { consumeBadURL } from './bad-url';
import { consumeEscapedCodePoint } from './escaped-code-point';
import { consumeWhiteSpace } from './whitespace-token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-url-token
export function consumeUrlToken(ctx: Context, reader: CodePointReader): TokenURL|TokenBadURL {
	consumeWhiteSpace(ctx, reader);
	let string = '';

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			const representation = reader.representation();
			ctx.onParseError({
				message: 'Unexpected EOF while consuming a url token.',
				start: representation[0],
				end: representation[1],
				state: [
					'4.3.6. Consume a url token',
					'Unexpected EOF',
				],
			});

			return [
				TokenType.URL,
				reader.representationString(),
				...representation,
				{
					value: string,
				},
			];
		}

		if (peeked === RIGHT_PARENTHESIS) {
			reader.readCodePoint();
			return [
				TokenType.URL,
				reader.representationString(),
				...reader.representation(),
				{
					value: string,
				},
			];
		}

		if (isWhitespace(peeked)) {
			consumeWhiteSpace(ctx, reader);
			const peeked2 = reader.peekOneCodePoint();
			if (peeked2 === false) {
				const representation = reader.representation();
				ctx.onParseError({
					message: 'Unexpected EOF while consuming a url token.',
					start: representation[0],
					end: representation[1],
					state: [
						'4.3.6. Consume a url token',
						'Consume as much whitespace as possible',
						'Unexpected EOF',
					],
				});

				return [
					TokenType.URL,
					reader.representationString(),
					...representation,
					{
						value: string,
					},
				];
			}

			if (peeked2 === RIGHT_PARENTHESIS) {
				reader.readCodePoint();
				return [
					TokenType.URL,
					reader.representationString(),
					...reader.representation(),
					{
						value: string,
					},
				];
			}

			consumeBadURL(ctx, reader);
			return [
				TokenType.BadURL,
				reader.representationString(),
				...reader.representation(),
				undefined,
			];
		}

		if (peeked === QUOTATION_MARK || peeked === APOSTROPHE || peeked === LEFT_PARENTHESIS || isNonPrintableCodePoint(peeked)) {
			consumeBadURL(ctx, reader);

			const representation = reader.representation();
			ctx.onParseError({
				message: 'Unexpected character while consuming a url token.',
				start: representation[0],
				end: representation[1],
				state: [
					'4.3.6. Consume a url token',
					'Unexpected U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE (\'), U+0028 LEFT PARENTHESIS (() or non-printable code point',
				],
			});

			return [
				TokenType.BadURL,
				reader.representationString(),
				...representation,
				undefined,
			];
		}

		if (peeked === REVERSE_SOLIDUS) {
			if (checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
				string += String.fromCharCode(consumeEscapedCodePoint(ctx, reader));
				continue;
			}

			consumeBadURL(ctx, reader);

			const representation = reader.representation();
			ctx.onParseError({
				message: 'Invalid escape sequence while consuming a url token.',
				start: representation[0],
				end: representation[1],
				state: [
					'4.3.6. Consume a url token',
					'U+005C REVERSE SOLIDUS (\\)',
					'The input stream does not start with a valid escape sequence',
				],
			});

			return [
				TokenType.BadURL,
				reader.representationString(),
				...representation,
				undefined,
			];
		}

		reader.readCodePoint();
		string += String.fromCharCode(peeked);
	}
}
