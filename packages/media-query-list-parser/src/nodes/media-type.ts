import type { TokenIdent} from '@csstools/css-tokenizer';
import { isTokenIdent } from '@csstools/css-tokenizer';

export enum MediaType {
	/** Always matches */
	All = 'all',
	Print = 'print',
	Screen = 'screen',
	/** Never matches */
	Tty = 'tty',
	/** Never matches */
	Tv = 'tv',
	/** Never matches */
	Projection = 'projection',
	/** Never matches */
	Handheld = 'handheld',
	/** Never matches */
	Braille = 'braille',
	/** Never matches */
	Embossed = 'embossed',
	/** Never matches */
	Aural = 'aural',
	/** Never matches */
	Speech = 'speech',
}

export function typeFromToken(token: TokenIdent): MediaType | false {
	if (!isTokenIdent(token)) {
		return false;
	}

	const matchingValue = token[4].value.toLowerCase();
	switch (matchingValue as MediaType) {
		case MediaType.All:
			return MediaType.All;
		case MediaType.Print:
			return MediaType.Print;
		case MediaType.Screen:
			return MediaType.Screen;
		case MediaType.Tty:
			return MediaType.Tty;
		case MediaType.Tv:
			return MediaType.Tv;
		case MediaType.Projection:
			return MediaType.Projection;
		case MediaType.Handheld:
			return MediaType.Handheld;
		case MediaType.Braille:
			return MediaType.Braille;
		case MediaType.Embossed:
			return MediaType.Embossed;
		case MediaType.Aural:
			return MediaType.Aural;
		case MediaType.Speech:
			return MediaType.Speech;
		default:
			return false;
	}
}
