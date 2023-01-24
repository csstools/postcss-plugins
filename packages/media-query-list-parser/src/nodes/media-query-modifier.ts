import { TokenIdent, TokenType } from '@csstools/css-tokenizer';

export enum MediaQueryModifier {
	Not = 'not',
	Only = 'only'
}

export function modifierFromToken(token: TokenIdent): MediaQueryModifier | false {
	if (token[0] !== TokenType.Ident) {
		return false;
	}

	const matchingValue = token[4].value.toLowerCase();
	switch (matchingValue) {
		case MediaQueryModifier.Not:
			return MediaQueryModifier.Not;
		case MediaQueryModifier.Only:
			return MediaQueryModifier.Only;
		default:
			return false;
	}
}
