import { TokenNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType, isTokenDimension, isTokenNumber, isTokenPercentage } from '@csstools/css-tokenizer';
import { convertUnit } from '../unit-conversions';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function subtraction(inputs: Array<TokenNode>): TokenNode | -1 {
	if (inputs.length !== 2) {
		return -1;
	}

	const aToken = inputs[0].value;
	let bToken = inputs[1].value;

	// 10 - 5
	if (isTokenNumber(aToken) && isTokenNumber(bToken)) {
		const result = aToken[4].value - bToken[4].value;

		return new TokenNode([TokenType.Number, result.toString(), aToken[2], bToken[3], {
			value: result,
			type: (aToken[4].type === NumberType.Integer && bToken[4].type === NumberType.Integer) ? NumberType.Integer : NumberType.Number,
		}]);
	}

	// 10% - 5%
	if (isTokenPercentage(aToken)  && isTokenPercentage(bToken)) {
		const result = aToken[4].value - bToken[4].value;

		return new TokenNode([TokenType.Percentage, result.toString() + '%', aToken[2], bToken[3], {
			value: result,
		}]);
	}

	// 10px - 5px
	if (
		isTokenDimension(aToken)  && isTokenDimension(bToken)
	) {
		bToken = convertUnit(aToken, bToken);

		if (toLowerCaseAZ(aToken[4].unit) === toLowerCaseAZ(bToken[4].unit)) {
			const result = aToken[4].value - bToken[4].value;

			return new TokenNode([TokenType.Dimension, result.toString() + aToken[4].unit, aToken[2], bToken[3], {
				value: result,
				type: (aToken[4].type === NumberType.Integer && bToken[4].type === NumberType.Integer) ? NumberType.Integer : NumberType.Number,
				unit: aToken[4].unit,
			}]);
		}
	}

	return -1;
}
