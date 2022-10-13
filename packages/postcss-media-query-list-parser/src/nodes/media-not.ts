import { MediaInParens } from './media-in-parens';

export class MediaNot {
	type = 'media-not';

	media: MediaInParens;

	constructor(media: MediaInParens) {
		this.media = media;
	}

	toString() {
		return 'not ' + this.media.toString();
	}
}
