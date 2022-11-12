import { checkIfThreeCodePointsWouldStartAnIdentSequence } from '../checks/three-code-points-would-start-ident-sequence';
import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { codePointsToString } from '../code-points/code-points-to-string';
import { isIdentCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { HashType, TokenDelim, TokenHash, TokenType } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function consumeHashToken(ctx: Context, reader: CodePointReader): TokenDelim|TokenHash {
	reader.readCodePoint();

	const peeked = reader.peekOneCodePoint();
	if (
		peeked !== false &&
		isIdentCodePoint(peeked) ||
		checkIfTwoCodePointsAreAValidEscape(ctx, reader)
	) {
		let hashType = HashType.Unrestricted;

		if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
			hashType = HashType.ID;
		}

		const identSequence = consumeIdentSequence(ctx, reader);
		const representation = reader.representation();
		return [
			TokenType.Hash,
			reader.representationString(),
			representation[0],
			representation[1],
			{
				value: codePointsToString(identSequence),
				type: hashType,
			},
		];
	}

	const representation = reader.representation();
	return [
		TokenType.Delim,
		reader.representationString(),
		representation[0],
		representation[1],
		{
			value: '#',
		},
	];
}
