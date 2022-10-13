import { MediaCondition } from './media-condition';
import { MediaConditionWithoutOr } from './media-condition-without-or-or';
import { MediaQueryModifier } from './media-query-modifier';
import { MediaType } from './media-type';

export type MediaQuery = MediaQueryWithType | MediaQueryWithoutType;

export class MediaQueryWithType {
	type = 'media-query-with-type';

	modifier?: MediaQueryModifier;
	mediaType: MediaType;
	media?: MediaConditionWithoutOr;

	constructor(modifier: MediaQueryModifier | null, mediaType: MediaType, media: MediaConditionWithoutOr | null) {
		this.modifier = modifier;
		this.mediaType = mediaType;
		this.media = media;
	}

	toString() {
		if (this.modifier && this.media) {
			return `${this.modifier} ${this.mediaType} and ${this.media.toString()}`;
		}

		if (this.modifier) {
			return `${this.modifier} ${this.mediaType}`;
		}

		if (this.media) {
			return `${this.mediaType} and ${this.media.toString()}`;
		}

		return this.mediaType;
	}
}

export class MediaQueryWithoutType {
	type = 'media-query-without-type';

	media: MediaCondition;

	constructor(media: MediaCondition) {
		this.media = media;
	}

	toString() {
		return this.media.toString();
	}
}
