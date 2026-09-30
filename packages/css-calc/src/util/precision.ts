import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode } from '@csstools/css-parser-algorithms';
import { isTokenDimension, isTokenNumber, isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';

export function patchPrecision(x: TokenNode | FunctionNode | -1, precision = 13): TokenNode | FunctionNode | -1 {
	if (x === -1) {
		return -1;
	}

	if (precision <= 0) {
		return x;
	}

	if (isFunctionNode(x)) {
		return x;
	}

	const token = x.value;
	if (!isTokenNumeric(token)) {
		return x;
	}

	if (shouldSkipPrecisionRounding(token[4].value)) {
		return x;
	}

	const result = roundToPrecision(token[4].value, precision).toString();

	if (isTokenNumber(token)) {
		token[1] = result;
	} else if (isTokenPercentage(token)) {
		token[1] = result + '%';
	} else if (isTokenDimension(token)) {
		token[1] = result + token[4].unit;
	}

	return x;
}

/**
 * Returns `true` when rounding a value to a number of decimals can not change it.
 * Non-finite values, zero, integers and values that serialize in scientific
 * notation are left untouched.
 *
 * Rounding scientific notation values would destroy them (e.g. `1e-20` -> `0`).
 */
function shouldSkipPrecisionRounding(value: number): boolean {
	if (!Number.isFinite(value) || value === 0) {
		return true;
	}

	if (Number.isInteger(value)) {
		return true;
	}

	const serialized = value.toString();
	return serialized.includes('e') || serialized.includes('E');
}

export function roundToPrecision(value: number, precision = 13): number {
	if (shouldSkipPrecisionRounding(value)) {
		return value;
	}

	// Otherwise round to a number of decimals.
	return Number(value.toFixed(precision));
}
