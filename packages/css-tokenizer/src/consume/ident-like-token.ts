import { checkIfCodePointsMatchURLIdent } from '../checks/matches-url-ident';
import { APOSTROPHE, LEFT_PARENTHESIS, QUOTATION_MARK } from '../code-points/code-points';
import { isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenBadURL, TokenFunction, TokenIdent, TokenType, TokenURL } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';
import { consumeUrlToken } from './url-token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-ident-like-token
export function consumeIdentLikeToken(ctx: Context, reader: CodePointReader): TokenIdent | TokenFunction | TokenURL | TokenBadURL {
	const codePoints = consumeIdentSequence(ctx, reader);

	if (reader.peekedOne === LEFT_PARENTHESIS) {
		if (checkIfCodePointsMatchURLIdent(ctx, codePoints)) {
			reader.readCodePoint();

			let read = 0;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const firstIsWhitespace = isWhitespace(reader.peekedOne);
				const secondIsWhitespace = isWhitespace(reader.peekedTwo);
				if (firstIsWhitespace && secondIsWhitespace) {
					read += 2;
					reader.readCodePoint(2);
					continue;
				}

				const firstNonWhitespace = firstIsWhitespace ? reader.peekedTwo : reader.peekedOne;
				if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
					for (let i = 0; i < read; i++) {
						reader.unreadCodePoint();
					}

					return [
						TokenType.Function,
						reader.representationString(),
						reader.representationStart,
						reader.representationEnd,
						{
							value: String.fromCharCode(...codePoints),
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

		reader.readCodePoint();
		return [
			TokenType.Function,
			reader.representationString(),
			reader.representationStart,
			reader.representationEnd,
			{
				value: String.fromCharCode(...codePoints),
			},
		];
	}

	return [
		TokenType.Ident,
		reader.representationString(),
		reader.representationStart,
		reader.representationEnd,
		{
			value: String.fromCharCode(...codePoints),
		},
	];
}
