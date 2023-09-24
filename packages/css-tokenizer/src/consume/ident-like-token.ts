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

	if (reader.codePointSource[reader.cursor] !== LEFT_PARENTHESIS) {
		return [
			TokenType.Ident,
			reader.source.slice(reader.representationStart, reader.representationEnd + 1),
			reader.representationStart,
			reader.representationEnd,
			{
				value: String.fromCodePoint(...codePoints),
			},
		];
	}

	if (checkIfCodePointsMatchURLIdent(codePoints)) {
		reader.advanceCodePoint();

		let read = 0;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const firstIsWhitespace = isWhitespace(reader.codePointSource[reader.cursor]);
			const secondIsWhitespace = isWhitespace(reader.codePointSource[reader.cursor+1]);
			if (firstIsWhitespace && secondIsWhitespace) {
				read = read + 1;
				reader.advanceCodePoint(1);
				continue;
			}

			const firstNonWhitespace = firstIsWhitespace ? reader.codePointSource[reader.cursor+1] : reader.codePointSource[reader.cursor];
			if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
				if (read > 0) {
					// https://github.com/w3c/csswg-drafts/issues/8280#issuecomment-1370566921
					reader.unreadCodePoint(read);
				}

				return [
					TokenType.Function,
					reader.source.slice(reader.representationStart, reader.representationEnd + 1),
					reader.representationStart,
					reader.representationEnd,
					{
						value: String.fromCodePoint(...codePoints),
					},
				];
			}

			break;
		}

		return consumeUrlToken(ctx, reader);
	}

	reader.advanceCodePoint();
	return [
		TokenType.Function,
		reader.source.slice(reader.representationStart, reader.representationEnd + 1),
		reader.representationStart,
		reader.representationEnd,
		{
			value: String.fromCodePoint(...codePoints),
		},
	];
}
