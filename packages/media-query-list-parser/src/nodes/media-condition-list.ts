import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaAnd, MediaAndWalkerEntry, MediaAndWalkerParent } from './media-and';
import { MediaInParens } from './media-in-parens';
import { MediaOr, MediaOrWalkerEntry, MediaOrWalkerParent } from './media-or';
import { NodeType } from '../util/node-type';

export type MediaConditionList = MediaConditionListWithAnd | MediaConditionListWithOr;

export class MediaConditionListWithAnd {
	type = NodeType.MediaConditionListWithAnd;

	leading: MediaInParens;
	list: Array<MediaAnd>;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(leading: MediaInParens, list: Array<MediaAnd>, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.leading = leading;
		this.list = list;
		this.before = before;
		this.after = after;
	}

	tokens(): Array<CSSToken> {
		return [
			...this.before,
			...this.leading.tokens(),
			...this.list.flatMap((item) => item.tokens()),
			...this.after,
		];
	}

	toString(): string {
		return stringify(...this.before) + this.leading.toString() + this.list.map((item) => item.toString()).join('') + stringify(...this.after);
	}

	indexOf(item: MediaInParens | MediaAnd): number | string {
		if (item === this.leading) {
			return 'leading';
		}

		if (item.type === 'media-and') {
			return this.list.indexOf(item as MediaAnd);
		}

		return -1;
	}

	at(index: number | string): MediaInParens | MediaAnd | undefined {
		if (index === 'leading') {
			return this.leading;
		}

		if (typeof index === 'number') {
			if (index < 0) {
				index = this.list.length + index;
			}
			return this.list[index];
		}
	}

	walk(cb: (entry: { node: MediaConditionListWithAndWalkerEntry, parent: MediaConditionListWithAndWalkerParent }, index: number | string) => boolean | void) {
		if (cb({ node: this.leading, parent: this }, 'leading') === false) {
			return false;
		}

		if ('walk' in this.leading) {
			if (this.leading.walk(cb) === false) {
				return false;
			}
		}

		let aborted = false;

		this.list.forEach((child, index) => {
			if (aborted) {
				return;
			}

			if (cb({ node: child, parent: this }, index) === false) {
				aborted = true;
				return;
			}

			if ('walk' in child) {
				if (child.walk(cb) === false) {
					aborted = true;
					return;
				}
			}
		});

		if (aborted) {
			return false;
		}
	}

	toJSON() {
		return {
			type: this.type,
			leading: this.leading.toJSON(),
			list: this.list.map((x) => x.toJSON()),
			before: this.before,
			after: this.after,
		};
	}

	isMediaConditionListWithAnd(): this is MediaConditionListWithAnd {
		return MediaConditionListWithAnd.isMediaConditionListWithAnd(this);
	}

	static isMediaConditionListWithAnd(x: unknown): x is MediaConditionListWithAnd {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaConditionListWithAnd)) {
			return false;
		}

		return x.type === NodeType.MediaConditionListWithAnd;
	}
}

export type MediaConditionListWithAndWalkerEntry = MediaAndWalkerEntry | MediaAnd;
export type MediaConditionListWithAndWalkerParent = MediaAndWalkerParent | MediaConditionListWithAnd;

export class MediaConditionListWithOr {
	type = NodeType.MediaConditionListWithOr;

	leading: MediaInParens;
	list: Array<MediaOr>;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(leading: MediaInParens, list: Array<MediaOr>, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.leading = leading;
		this.list = list;
		this.before = before;
		this.after = after;
	}

	tokens(): Array<CSSToken> {
		return [
			...this.before,
			...this.leading.tokens(),
			...this.list.flatMap((item) => item.tokens()),
			...this.after,
		];
	}

	toString(): string {
		return stringify(...this.before) + this.leading.toString() + this.list.map((item) => item.toString()).join('') + stringify(...this.after);
	}

	indexOf(item: MediaInParens | MediaOr): number | string {
		if (item === this.leading) {
			return 'leading';
		}

		if (item.type === 'media-or') {
			return this.list.indexOf(item as MediaOr);
		}

		return -1;
	}

	at(index: number | string): MediaInParens | MediaOr | undefined {
		if (index === 'leading') {
			return this.leading;
		}

		if (typeof index === 'number') {
			if (index < 0) {
				index = this.list.length + index;
			}
			return this.list[index];
		}
	}

	walk(cb: (entry: { node: MediaConditionListWithOrWalkerEntry, parent: MediaConditionListWithOrWalkerParent }, index: number | string) => boolean | void) {
		if (cb({ node: this.leading, parent: this }, 'leading') === false) {
			return false;
		}

		if ('walk' in this.leading) {
			if (this.leading.walk(cb) === false) {
				return false;
			}
		}

		let aborted = false;

		this.list.forEach((child, index) => {
			if (aborted) {
				return;
			}

			if (cb({ node: child, parent: this }, index) === false) {
				aborted = true;
				return;
			}

			if ('walk' in child) {
				if (child.walk(cb) === false) {
					aborted = true;
					return;
				}
			}
		});

		if (aborted) {
			return false;
		}
	}

	toJSON() {
		return {
			type: this.type,
			leading: this.leading.toJSON(),
			list: this.list.map((x) => x.toJSON()),
			before: this.before,
			after: this.after,
		};
	}

	isMediaConditionListWithOr(): this is MediaConditionListWithOr {
		return MediaConditionListWithOr.isMediaConditionListWithOr(this);
	}

	static isMediaConditionListWithOr(x: unknown): x is MediaConditionListWithOr {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaConditionListWithOr)) {
			return false;
		}

		return x.type === NodeType.MediaConditionListWithOr;
	}
}

export type MediaConditionListWithOrWalkerEntry = MediaOrWalkerEntry | MediaOr;
export type MediaConditionListWithOrWalkerParent = MediaOrWalkerParent | MediaConditionListWithOr;
