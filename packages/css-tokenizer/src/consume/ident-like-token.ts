import { checkIfCodePointsMatchURLIdent } from '../checks/matches-url-ident';
import { APOSTROPHE, LEFT_PARENTHESIS, QUOTATION_MARK } from '../code-points/code-points';
import { codePointsToString } from '../code-points/code-points-to-string';
import { isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenBadURL, TokenFunction, TokenIdent, TokenType, TokenURL } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';
import { consumeUrlToken } from './url-token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-ident-like-token
export function consumeIdentLikeToken(ctx: Context, reader: CodePointReader): TokenIdent | TokenFunction | TokenURL | TokenBadURL {
	const codePoints = consumeIdentSequence(ctx, reader);
	const peeked = reader.peekOneCodePoint();

	if (checkIfCodePointsMatchURLIdent(ctx, codePoints)) {
		if (peeked === LEFT_PARENTHESIS) {
			reader.readCodePoint();

			let read = 0;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const peeked2 = reader.peekTwoCodePoints();
				const firstIsWhitespace = isWhitespace(peeked2[0]);
				const secondIsWhitespace = isWhitespace(peeked2[1]);
				if (firstIsWhitespace && secondIsWhitespace) {
					read += 2;
					reader.readCodePoint();
					reader.readCodePoint();
					continue;
				}

				const firstNonWhitespace = firstIsWhitespace ? peeked2[1] : peeked2[0];
				if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
					for (let i = 0; i < read; i++) {
						reader.unreadCodePoint();
					}

					const representation = reader.representation();
					return [
						TokenType.Function,
						reader.representationString(),
						representation[0],
						representation[1],
						{
							value: codePointsToString(codePoints),
						},
					];
				}

				break;
			}

			for (let i = 0; i < read; i++) {
				reader.unreadCodePoint();
			}

			return consumeUrlToken(ctx, reader);
		}
	}

	if (peeked === LEFT_PARENTHESIS) {
		reader.readCodePoint();
		const representation = reader.representation();
		return [
			TokenType.Function,
			reader.representationString(),
			representation[0],
			representation[1],
			{
				value: codePointsToString(codePoints),
			},
		];
	}

	const representation = reader.representation();
	return [
		TokenType.Ident,
		reader.representationString(),
		representation[0],
		representation[1],
		{
			value: codePointsToString(codePoints),
		},
	];
}
