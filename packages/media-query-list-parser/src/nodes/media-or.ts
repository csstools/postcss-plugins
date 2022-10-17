import { MediaInParens } from './media-in-parens';

export class MediaOr {
	type = 'media-or';

	media: MediaInParens;

	constructor(media: MediaInParens) {
		this.media = media;
	}

	toString() {
		return 'or ' + this.media.toString();
	}
}
