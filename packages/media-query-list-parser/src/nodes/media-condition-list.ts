import { MediaAnd } from './media-and';
import { MediaInParens } from './media-in-parens';
import { MediaOr } from './media-or';

export type MediaConditionList = MediaConditionListWithAnd | MediaConditionListWithOr;

export class MediaConditionListWithAnd {
	type = 'media-condition-list-and';

	leading: MediaInParens;
	list: Array<MediaAnd>;

	constructor(leading: MediaInParens, list: Array<MediaAnd>) {
		this.leading = leading;
		this.list = list;
	}

	toString() {
		if (this.list.length === 0) {
			return this.leading.toString();
		}

		return this.leading.toString() + ' ' + this.list.map((x) => x.toString()).join(' ');
	}
}

export class MediaConditionListWithOr {
	type = 'media-condition-list-or';

	leading: MediaInParens;
	list: Array<MediaOr>;

	constructor(leading: MediaInParens, list: Array<MediaOr>) {
		this.leading = leading;
		this.list = list;
	}

	toString() {
		if (this.list.length === 0) {
			return this.leading.toString();
		}

		return this.leading.toString() + ' ' + this.list.map((x) => x.toString()).join(' ');
	}
}
