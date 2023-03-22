import { TokenIdent, TokenType } from '@csstools/css-tokenizer';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export enum MediaQueryModifier {
	Not = 'not',
	Only = 'only'
}

export function modifierFromToken(token: TokenIdent): MediaQueryModifier | false {
	if (token[0] !== TokenType.Ident) {
		return false;
	}

	const matchingValue = toLowerCaseAZ(token[4].value);
	switch (matchingValue) {
		case MediaQueryModifier.Not:
			return MediaQueryModifier.Not;
		case MediaQueryModifier.Only:
			return MediaQueryModifier.Only;
		default:
			return false;
	}
}
