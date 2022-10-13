import { GeneralEnclosed } from './general-enclosed';
import { MediaCondition } from './media-condition';
import { MediaFeature } from './media-feature';

export class MediaInParens {
	type = 'media-in-parens';

	media: MediaCondition | MediaFeature | GeneralEnclosed;

	constructor(media: MediaCondition | MediaFeature | GeneralEnclosed) {
		this.media = media;
	}

	toString() {
		if (this.media.type === 'general-enclosed') {
			return this.media.toString();
		}

		if (this.media.type === 'media-feature') {
			return this.media.toString();
		}

		if (this.media.type === 'media-condition') {
			return '(' + this.media.toString() + ')';
		}

		return this.media.toString();
	}
}
