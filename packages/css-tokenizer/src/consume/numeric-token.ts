import { checkIfThreeCodePointsWouldStartAnIdentSequence } from '../checks/three-code-points-would-start-ident-sequence';
import { PERCENTAGE_SIGN } from '../code-points/code-points';
import { codePointsToString } from '../code-points/code-points-to-string';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenDimension, TokenNumber, TokenPercentage, TokenType } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';
import { consumeNumber } from './number';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-numeric-token
export function consumeNumericToken(ctx: Context, reader: CodePointReader): TokenPercentage|TokenNumber|TokenDimension {
	const numberValue = consumeNumber(ctx, reader);

	if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
		const unit = consumeIdentSequence(ctx, reader);

		const representation = reader.representation();
		return [
			TokenType.Dimension,
			reader.representationString(),
			representation[0],
			representation[1],
			{
				value: numberValue[0],
				type: numberValue[1],
				unit: codePointsToString(unit),
			},
		];
	}

	{
		const peeked = reader.peekOneCodePoint();
		if (peeked === PERCENTAGE_SIGN) {
			reader.readCodePoint();

			const representation = reader.representation();
			return [
				TokenType.Percentage,
				reader.representationString(),
				representation[0],
				representation[1],
				{
					value: numberValue[0],
				},
			];
		}
	}

	const representation = reader.representation();
	return [
		TokenType.Number,
		reader.representationString(),
		representation[0],
		representation[1],
		{
			value: numberValue[0],
			type: numberValue[1],
		},
	];
}
