import { checkIfThreeCodePointsWouldStartAnIdentSequence } from '../checks/three-code-points-would-start-ident-sequence';
import { checkIfTwoCodePointsAreAValidEscape } from '../checks/two-code-points-are-valid-escape';
import { isIdentCodePoint } from '../code-points/ranges';
import type { CodePointReader } from '../interfaces/code-point-reader';
import type { Context } from '../interfaces/context';
import type { TokenDelim, TokenHash} from '../interfaces/token';
import { HashType, TokenType } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
export function consumeHashToken(ctx: Context, reader: CodePointReader): TokenDelim|TokenHash {
	reader.advanceCodePoint();

	const codePoint = reader.source.codePointAt(reader.cursor);
	if (
		(typeof codePoint !== "undefined") && (
			isIdentCodePoint(codePoint) ||
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
