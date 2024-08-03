import type { CSSToken, TokenDimension, TokenNumber, TokenPercentage} from '@csstools/css-tokenizer';
import { isTokenDimension, isTokenNumber, isTokenNumeric } from '@csstools/css-tokenizer';
import { toLowerCaseAZ } from './to-lower-case-a-z';

export function isDimensionOrNumber(x: CSSToken): x is TokenDimension | TokenNumber {
	return isTokenDimension(x) || isTokenNumber(x);
}

export function arrayOfSameNumeric<T extends TokenDimension | TokenPercentage | TokenNumber>(x: Array<CSSToken>): x is Array<T> {
	if (x.length === 0) {
		return true;
	}

	const firstToken = x[0];
	if (!isTokenNumeric(firstToken)) {
		return false;
	}

	if (x.length === 1) {
		return true;
	}

	if (isTokenDimension(firstToken)) {
		const unit = toLowerCaseAZ(firstToken[4].unit);

		for (let i = 1; i < x.length; i++) {
			const otherToken = x[i];
			if (firstToken[0] !== otherToken[0]) {
				return false;
			}

			if (unit !== toLowerCaseAZ(otherToken[4].unit)) {
				return false;
			}
		}

		return true;
	}

	for (let i = 1; i < x.length; i++) {
		const otherToken = x[i];
		if (firstToken[0] !== otherToken[0]) {
			return false;
		}
	}

	return true;
}

export function twoOfSameNumeric<T extends TokenDimension | TokenPercentage | TokenNumber>(x: T, y: CSSToken): y is T {
	if (!isTokenNumeric(x)) {
		return false;
	}

	if (isTokenDimension(x)) {
		if (x[0] !== y[0]) {
			return false;
		}

		if (toLowerCaseAZ(x[4].unit) !== toLowerCaseAZ(y[4].unit)) {
			return false;
		}

		return true;
	}

	if (x[0] !== y[0]) {
		return false;
	}

	return true;
}
