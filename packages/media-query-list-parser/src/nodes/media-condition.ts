import { ComponentValue } from '@csstools/css-parser-algorithms';
import { MediaConditionListWithAnd, MediaConditionListWithAndWalkerEntry, MediaConditionListWithAndWalkerParent, MediaConditionListWithOr, MediaConditionListWithOrWalkerEntry, MediaConditionListWithOrWalkerParent, parseMediaConditionListWithAnd, parseMediaConditionListWithOr } from './media-condition-list';
import { MediaInParens, parseMediaInParens } from './media-in-parens';
import { MediaNot, MediaNotWalkerEntry, MediaNotWalkerParent, parseMediaNot } from './media-not';

export class MediaCondition {
	type = 'media-condition';

	media: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr;

	constructor(media: MediaNot | MediaInParens |MediaConditionListWithAnd | MediaConditionListWithOr) {
		this.media = media;
	}

	tokens() {
		return this.media.tokens();
	}

	toString() {
		return this.media.toString();
	}

	indexOf(item: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr): number | string {
		if (item === this.media) {
			return 'media';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'media') {
			return this.media;
		}
	}

	walk(cb: (entry: { node: MediaConditionWalkerEntry, parent: MediaConditionWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}
}

export type MediaConditionWalkerEntry = MediaNotWalkerEntry | MediaConditionListWithAndWalkerEntry | MediaConditionListWithOrWalkerEntry | MediaNot | MediaConditionListWithAnd | MediaConditionListWithOr;
export type MediaConditionWalkerParent = MediaNotWalkerParent | MediaConditionListWithAndWalkerParent | MediaConditionListWithOrWalkerParent | MediaCondition;

export function parseMediaCondition(componentValues: Array<ComponentValue>) {
	const mediaNot = parseMediaNot(componentValues);
	if (mediaNot !== false) {
		return new MediaCondition(mediaNot);
	}

	const mediaListAnd = parseMediaConditionListWithAnd(componentValues);
	if (mediaListAnd !== false) {
		return new MediaCondition(mediaListAnd);
	}

	const mediaListOr = parseMediaConditionListWithOr(componentValues);
	if (mediaListOr !== false) {
		return new MediaCondition(mediaListOr);
	}

	const mediaInParens = parseMediaInParens(componentValues);
	if (mediaInParens !== false) {
		return new MediaCondition(mediaInParens);
	}

	return false;
}
