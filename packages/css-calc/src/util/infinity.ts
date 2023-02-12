import { TokenNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer/dist/interfaces/token';

export function Infinity_Token(result: number, a: CSSToken, b: CSSToken): TokenNode | null {
	if (!Number.isFinite(result)) {
		let signStr = '';
		let value = Number.POSITIVE_INFINITY;
		if (Number.NEGATIVE_INFINITY === result) {
			signStr = '-';
			value = Number.NEGATIVE_INFINITY;
		}

		if (a[0] === TokenType.Number) {
			return new TokenNode([a[0], signStr + Number.MAX_SAFE_INTEGER.toString(), a[2], b[3], {
				value: value,
				type: NumberType.Integer,
			}]);
		}
		if (a[0] === TokenType.Percentage) {
			return new TokenNode([a[0], signStr + Number.MAX_SAFE_INTEGER.toString() + '%', a[2], b[3], {
				value: value,
			}]);
		}
		if (a[0] === TokenType.Dimension) {
			return new TokenNode([a[0], signStr + Number.MAX_SAFE_INTEGER.toString() + a[4].unit, a[2], b[3], {
				value: value,
				unit: a[4].unit,
				type: NumberType.Integer,
			}]);
		}
	}

	return;
}
