import { MediaInParens } from './media-in-parens';

export class MediaAnd {
	type = 'media-and';

	media: MediaInParens;

	constructor(media: MediaInParens) {
		this.media = media;
	}

	toString() {
		return 'and' + this.media.toString();
	}
}
