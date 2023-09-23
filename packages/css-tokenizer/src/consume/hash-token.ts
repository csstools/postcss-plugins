import { checkIfThreeCodePointsWouldStartAnIdentSequence } from '../checks/three-code-points-would-start-ident-sequence';
import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { isIdentCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { HashType, TokenDelim, TokenHash, TokenType } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function consumeHashToken(ctx: Context, reader: CodePointReader): TokenDelim|TokenHash {
	reader.advanceCodePoint();

	if (
		(reader.codePointSource[reader.cursor] !== undefined) && (
			isIdentCodePoint(reader.codePointSource[reader.cursor]) ||
			checkIfTwoCodePointsAreAValidEscape(reader)
		)
	) {
		let hashType = HashType.Unrestricted;

		if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
			hashType = HashType.ID;
		}

		const identSequence = consumeIdentSequence(ctx, reader);
		return [
			TokenType.Hash,
			reader.source.slice(reader.representationStart, reader.representationEnd + 1),
			reader.representationStart,
			reader.representationEnd,
			{
				value: String.fromCodePoint(...identSequence),
				type: hashType,
			},
		];
	}

	return [
		TokenType.Delim,
		'#',
		reader.representationStart,
		reader.representationEnd,
		{
			value: '#',
		},
	];
}
