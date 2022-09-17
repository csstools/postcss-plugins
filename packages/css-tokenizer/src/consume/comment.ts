import { ASTERISK, SOLIDUS } from '../codepoints/codepoints';
import { CodePointReader } from '../interfaces/code-point-reader';
import { TokenComment, TokenError, TokenType } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
export function consumeComment(reader: CodePointReader): TokenComment|TokenError|undefined {
	const open = reader.peekOneCodePoint();
	if (open === false) {
		return [
			TokenType.Error,
			'',
			...reader.representation(),
			{
				reason: 'parse error while consuming a comment, expected "*" after "/".',
			},
		];
	}

	if (open !== ASTERISK) {
		return;
	}

	reader.readCodePoint();

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const codePoint = reader.readCodePoint();
		if (codePoint === false) {
			return [
				TokenType.Error,
				'',
				...reader.representation(),
				{
					reason: 'parse error while consuming a comment, comment was unclosed before the end of the file.',
				},
			];
		}

		if (codePoint !== ASTERISK) {
			continue;
		}

		const close = reader.peekOneCodePoint();
		if (close === false) {
			return [
				TokenType.Error,
				'',
				...reader.representation(),
				{
					reason: 'parse error while consuming a comment, comment was unclosed before the end of the file.',
				},
			];
		}

		if (close === SOLIDUS) {
			reader.readCodePoint();

			return [
				TokenType.Comment,
				reader.representationString(),
				...reader.representation(),
			];
		}
	}
}
