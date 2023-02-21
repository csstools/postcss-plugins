import { CSSToken, TokenDimension, TokenNumber, TokenPercentage, TokenType } from '@csstools/css-tokenizer';

export function isNumeric(x: CSSToken): x is TokenDimension | TokenPercentage | TokenNumber {
	if (x[0] === TokenType.Dimension) {
		return true;
	}

	if (x[0] === TokenType.Percentage) {
		return true;
	}

	if (x[0] === TokenType.Number) {
		return true;
	}

	return false;
}

export function isDimensionOrNumber(x: CSSToken): x is TokenDimension | TokenNumber {
	if (x[0] === TokenType.Dimension) {
		return true;
	}

	if (x[0] === TokenType.Number) {
		return true;
	}

	return false;
}

export function arrayOfSameNumeric<T extends TokenDimension | TokenPercentage | TokenNumber>(x: Array<CSSToken>): x is Array<T> {
	if (x.length === 0) {
		return true;
	}

	const firstToken = x[0];
	if (!isNumeric(firstToken)) {
		return false;
	}

	if (x.length === 1) {
		return true;
	}

	if (firstToken[0] === TokenType.Dimension) {
		const unit = firstToken[4].unit.toLowerCase();

		for (let i = 1; i < x.length; i++) {
			const otherToken = x[i];
			if (firstToken[0] !== otherToken[0]) {
				return false;
			}

			if (unit !== otherToken[4].unit.toLowerCase()) {
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
	if (!isNumeric(x)) {
		return false;
	}

	if (x[0] === TokenType.Dimension) {
		if (x[0] !== y[0]) {
			return false;
		}

		if (x[4].unit.toLowerCase() !== y[4].unit.toLowerCase()) {
			return false;
		}

		return true;
	}

	if (x[0] !== y[0]) {
		return false;
	}

	return true;
}
