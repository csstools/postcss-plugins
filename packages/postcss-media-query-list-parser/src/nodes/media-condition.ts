import { MediaConditionListWithAnd, MediaConditionListWithOr } from './media-condition-list';
import { MediaNot } from './media-not';

export class MediaCondition {
	type = 'media-condition';

	media: MediaNot | MediaConditionListWithAnd | MediaConditionListWithOr;

	constructor(media: MediaNot | MediaConditionListWithAnd | MediaConditionListWithOr) {
		this.media = media;
	}

	toString() {
		return this.media.toString();
	}
}
