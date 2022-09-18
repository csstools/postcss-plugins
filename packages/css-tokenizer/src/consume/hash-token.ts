import { checkIfThreeCodePointsWouldStartAnIdentSequence } from '../checks/three-code-points-would-start-ident-sequence';
import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { isIdentCodePoint } from '../code-points/ranges';
import { CodePointReader } from '../interfaces/code-point-reader';
import { HashType, TokenDelim, TokenHash, TokenType } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';

export function consumeHashToken(reader: CodePointReader): TokenDelim|TokenHash {
	reader.readCodePoint();

	const peeked = reader.peekOneCodePoint();
	if (
		peeked !== false &&
		isIdentCodePoint(peeked) ||
		checkIfTwoCodePointsAreAValidEscape(reader)
	) {
		let hashType = HashType.Unrestricted;

		if (checkIfThreeCodePointsWouldStartAnIdentSequence(reader)) {
			hashType = HashType.ID;
		}

		const identSequence = consumeIdentSequence(reader);
		return [
			TokenType.Hash,
			reader.representationString(),
			...reader.representation(),
			{
				value: identSequence.map((x) => String.fromCharCode(x)).join(''),
				type: hashType,
			},
		];
	}

	return [
		TokenType.Delim,
		reader.representationString(),
		...reader.representation(),
		{
			value: '#',
		},
	];
}
