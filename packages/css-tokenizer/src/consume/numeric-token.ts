import { checkIfThreeCodePointsWouldStartAnIdentSequence } from '../checks/three-code-points-would-start-ident-sequence';
import { HYPHEN_MINUS, PERCENTAGE_SIGN, PLUS_SIGN } from '../code-points/code-points';
import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenDimension, TokenNumber, TokenPercentage, TokenType } from '../interfaces/token';
import { consumeIdentSequence } from './ident-sequence';
import { consumeNumber } from './number';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-numeric-token
export function consumeNumericToken(ctx: Context, reader: CodePointReader): TokenPercentage|TokenNumber|TokenDimension {
	let signCharacter: undefined | '+' | '-' = undefined;

	{
		const peeked = reader.codePointSource[reader.cursor];
		if (peeked === HYPHEN_MINUS) {
			signCharacter = '-';
		} else if (peeked === PLUS_SIGN) {
			signCharacter = '+';
		}
	}

	const numberType = consumeNumber(ctx, reader);
	let numberValue = parseFloat(reader.source.slice(reader.representationStart, reader.representationEnd + 1));
	if (numberValue === 0) {
		// fix for -0
		numberValue = 0;
	}

	if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
		const unit = consumeIdentSequence(ctx, reader);
		return [
			TokenType.Dimension,
			reader.source.slice(reader.representationStart, reader.representationEnd + 1),
			reader.representationStart,
			reader.representationEnd,
			{
				value: numberValue,
				signCharacter: signCharacter,
				type: numberType,
				unit: String.fromCodePoint(...unit),
			},
		];
	}

	if (reader.codePointSource[reader.cursor] === PERCENTAGE_SIGN) {
		reader.advanceCodePoint();

		return [
			TokenType.Percentage,
			reader.source.slice(reader.representationStart, reader.representationEnd + 1),
			reader.representationStart,
			reader.representationEnd,
			{
				value: numberValue,
				signCharacter: signCharacter,
			},
		];
	}

	return [
		TokenType.Number,
		reader.source.slice(reader.representationStart, reader.representationEnd + 1),
		reader.representationStart,
		reader.representationEnd,
		{
			value: numberValue,
			signCharacter: signCharacter,
			type: numberType,
		},
	];
}
