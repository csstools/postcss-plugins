import type { CSSToken, TokenDimension} from "@csstools/css-tokenizer";
import { isTokenDimension, NumberType, TokenType } from "@csstools/css-tokenizer";
import type { conversionOptions } from "../options";
import { convertUnit } from "../unit-conversions";
import { twoOfSameNumeric } from "./kind-of-number";
import { resultToCalculation } from "../functions/result-to-calculation";
import type { FunctionNode } from "@csstools/css-parser-algorithms";
import type { Calculation } from "../calculation";

export function snapAsBorderWidth(fnNode: FunctionNode, aToken: CSSToken, options: conversionOptions): Calculation | -1 {
	if (!isTokenDimension(aToken)) {
		return -1;
	}

	const devicePixelLength = options.devicePixelLength ?? 1;
	const devicePixelLengthToken: TokenDimension = [TokenType.Dimension, `${devicePixelLength}px`, aToken[2], aToken[3], { value: devicePixelLength, type: NumberType.Integer, unit: 'px' }];

	const aTokenAsPixels = convertUnit(devicePixelLengthToken, aToken);
	if (!twoOfSameNumeric(aTokenAsPixels, devicePixelLengthToken)) {
		return -1;
	}

	if (Number.isInteger(aTokenAsPixels[4].value / devicePixelLength)) {
		// If len is an integer number of device pixels, do nothing.
		return resultToCalculation(fnNode, aToken, aToken[4].value);
	}

	// Greater than 0
	if (aTokenAsPixels[4].value > 0) {
		if (aTokenAsPixels[4].value < devicePixelLength) {
			// If the absolute value is greater than zero, but less than 1 device pixel, round it away from zero to 1 device pixel.
			return resultToCalculation(fnNode, aToken, convertUnit(aToken, devicePixelLengthToken)[4].value);
		}

		// If the absolute value is greater than 1 device pixel, round it towards zero to the nearest integer number of device pixels.
		const down = Math.floor(aTokenAsPixels[4].value / devicePixelLengthToken[4].value) * devicePixelLengthToken[4].value;
		aTokenAsPixels[4].value = down;
		return resultToCalculation(fnNode, aToken, convertUnit(aToken, aTokenAsPixels)[4].value);
	}

	// Less than 0

	if (Math.abs(aTokenAsPixels[4].value) < devicePixelLength) {
		// If the absolute value is greater than zero, but less than 1 device pixel, round it away from zero to 1 device pixel.
		return resultToCalculation(fnNode, aToken, convertUnit(aToken, devicePixelLengthToken)[4].value * -1);
	}

	// If the absolute value is greater than 1 device pixel, round it towards zero to the nearest integer number of device pixels.
	const up = Math.ceil(aTokenAsPixels[4].value / devicePixelLengthToken[4].value) * devicePixelLengthToken[4].value;
	aTokenAsPixels[4].value = up;
	return resultToCalculation(fnNode, aToken, convertUnit(aToken, aTokenAsPixels)[4].value);
}
