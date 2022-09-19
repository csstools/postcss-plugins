import { checkIfCodePointsMatchURLIdent } from '../checks/matches-url-ident';
import { APOSTROPHE, LEFT_PARENTHESIS, QUOTATION_MARK } from '../code-points/code-points';
import { isWhitespace } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { TokenBadURL, TokenFunction, TokenIdent, TokenType, TokenURL } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';
import { consumeUrlToken } from './url-token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-ident-like-token
export function consumeIdentLikeToken(reader: CodePointReader): TokenIdent|TokenFunction|TokenURL|TokenBadURL {
	const codePoints = consumeIdentSequence(reader);
	if (checkIfCodePointsMatchURLIdent(codePoints)) {
		const peeked = reader.peekOneCodePoint();
		if (peeked === LEFT_PARENTHESIS) {
			reader.readCodePoint();

			let read = 0;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const peeked2 = reader.peekTwoCodePoints();
				if (isWhitespace(peeked2[0]) && isWhitespace(peeked2[1])) {
					read += 2;
					reader.readCodePoint();
					reader.readCodePoint();
					continue;
				}

				const firstNonWhitespace = isWhitespace(peeked2[0]) ? peeked2[0] : peeked2[1];
				if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
					for (let i = 0; i < read; i++) {
						reader.unreadCodePoint();
					}

					return [
						TokenType.Function,
						reader.representationString(),
						...reader.representation(),
						{
							value: codePoints.map((x) => String.fromCharCode(x)).join(''),
						},
					];
				}

				break;
			}

			for (let i = 0; i < read; i++) {
				reader.unreadCodePoint();
			}

			return consumeUrlToken(reader);
		}
	}

	const peeked = reader.peekOneCodePoint();
	if (peeked === LEFT_PARENTHESIS) {
		reader.readCodePoint();
		return [
			TokenType.Function,
			reader.representationString(),
			...reader.representation(),
			{
				value: codePoints.map((x) => String.fromCharCode(x)).join(''),
			},
		];
	}

	return [
		TokenType.Ident,
		reader.representationString(),
		...reader.representation(),
		{
			value: codePoints.map((x) => String.fromCharCode(x)).join(''),
		},
	];
}
