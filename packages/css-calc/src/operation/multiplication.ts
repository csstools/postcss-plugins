import { TokenNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType, isTokenDimension, isTokenNumber, isTokenPercentage } from '@csstools/css-tokenizer';

export function multiplication(inputs: Array<TokenNode>): TokenNode | -1 {
	if (inputs.length !== 2) {
		return -1;
	}

	const aToken = inputs[0].value;
	const bToken = inputs[1].value;

	// 10 * 5
	if (isTokenNumber(aToken) && isTokenNumber(bToken)) {
		const result = aToken[4].value * bToken[4].value;

		return new TokenNode([TokenType.Number, result.toString(), aToken[2], bToken[3], {
			value: result,
			type: (aToken[4].type === NumberType.Integer && bToken[4].type === NumberType.Integer) ? NumberType.Integer : NumberType.Number,
		}]);
	}

	// 10% * 5
	if (isTokenPercentage(aToken)  && isTokenNumber(bToken)) {
		const result = aToken[4].value * bToken[4].value;

		return new TokenNode([TokenType.Percentage, result.toString() + '%', aToken[2], bToken[3], {
			value: result,
		}]);
	}

	// 10 * 5%
	if (isTokenNumber(aToken) && isTokenPercentage(bToken)) {
		const result = aToken[4].value * bToken[4].value;

		return new TokenNode([TokenType.Percentage, result.toString() + '%', aToken[2], bToken[3], {
			value: result,
		}]);
	}

	// 10px * 5
	if (isTokenDimension(aToken)  && isTokenNumber(bToken)) {
		const result = aToken[4].value * bToken[4].value;

		return new TokenNode([TokenType.Dimension, result.toString() + aToken[4].unit, aToken[2], bToken[3], {
			value: result,
			type: (aToken[4].type === NumberType.Integer && bToken[4].type === NumberType.Integer) ? NumberType.Integer : NumberType.Number,
			unit: aToken[4].unit,
		}]);
	}

	// 10 * 5px
	if (isTokenNumber(aToken) && isTokenDimension(bToken)) {
		const result = aToken[4].value * bToken[4].value;

		return new TokenNode([TokenType.Dimension, result.toString() + bToken[4].unit, aToken[2], bToken[3], {
			value: result,
			type: (aToken[4].type === NumberType.Integer && bToken[4].type === NumberType.Integer) ? NumberType.Integer : NumberType.Number,
			unit: bToken[4].unit,
		}]);
	}

	return -1;
}
