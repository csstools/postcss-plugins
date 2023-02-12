import { TokenNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { Infinity_Token } from '../util/infinity';
import { NaN_Token } from '../util/nan';

export function division(inputs: Array<TokenNode>): TokenNode | -1 {
	if (inputs.length !== 2) {
		return -1;
	}

	const aToken = inputs[0].value;
	const bToken = inputs[1].value;

	// 10 / 5
	if (aToken[0] === TokenType.Number && bToken[0] === TokenType.Number) {
		const result = aToken[4].value / bToken[4].value;

		return NaN_Token(result, aToken, bToken) ?? Infinity_Token(result, aToken, bToken) ?? new TokenNode([TokenType.Number, result.toString(), aToken[2], bToken[3], {
			value: result,
			type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
		}]);
	}

	// 10% / 5
	if (aToken[0] === TokenType.Percentage && bToken[0] === TokenType.Number) {
		const result = aToken[4].value / bToken[4].value;

		return NaN_Token(result, aToken, bToken) ?? Infinity_Token(result, aToken, bToken) ?? new TokenNode([TokenType.Percentage, result.toString() + '%', aToken[2], bToken[3], {
			value: result,
		}]);
	}

	// 10px / 5
	if (aToken[0] === TokenType.Dimension && bToken[0] === TokenType.Number) {
		const result = aToken[4].value / bToken[4].value;

		return NaN_Token(result, aToken, bToken) ?? Infinity_Token(result, aToken, bToken) ?? new TokenNode([TokenType.Dimension, result.toString() + aToken[4].unit, aToken[2], bToken[3], {
			value: result,
			type: (aToken[4].type === NumberType.Integer && bToken[4].type === NumberType.Integer) ? NumberType.Integer : NumberType.Number,
			unit: aToken[4].unit,
		}]);
	}

	return -1;
}
