import { checkIfThreeCodePointsWouldStartAnIdentSequence } from '../checks/three-code-points-would-start-ident-sequence';
import { PERCENTAGE_SIGN } from '../code-points/code-points';
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

		return [
			TokenType.Dimension,
			reader.representationString(),
			...reader.representation(),
			{
				value: numberValue[0],
				type: numberValue[1],
				unit: unit.map((x) => String.fromCharCode(x)).join(''),
			},
		];
	}

	{
		const peeked = reader.peekOneCodePoint();
		if (peeked === PERCENTAGE_SIGN) {
			reader.readCodePoint();

			return [
				TokenType.Percentage,
				reader.representationString(),
				...reader.representation(),
				{
					value: numberValue[0],
				},
			];
		}
	}

	return [
		TokenType.Number,
		reader.representationString(),
		...reader.representation(),
		{
			value: numberValue[0],
			type: numberValue[1],
		},
	];
}
