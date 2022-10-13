import { MediaConditionListWithAnd } from './media-condition-list';
import { MediaNot } from './media-not';

export class MediaConditionWithoutOr {
	type = 'media-condition-without-or';

	media: MediaNot | MediaConditionListWithAnd;

	constructor(media: MediaNot | MediaConditionListWithAnd) {
		this.media = media;
	}

	toString() {
		return this.media.toString();
	}
}
