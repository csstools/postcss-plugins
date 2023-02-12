import { TokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer/dist/interfaces/token';

export function NaN_Token(result: number, a: CSSToken, b: CSSToken): TokenNode | null {
	if (Number.isNaN(result)) {
		return new TokenNode([TokenType.Ident, 'NaN', a[2], b[3], {
			value: 'NaN',
		}]);
	}

	return;
}
