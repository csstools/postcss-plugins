import { ComponentValue, ComponentValueType, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaAnd, MediaAndWalkerEntry, MediaAndWalkerParent, parseMediaAnd } from './media-and';
import { MediaInParens, parseMediaInParensFromSimpleBlock } from './media-in-parens';
import { MediaOr, MediaOrWalkerEntry, MediaOrWalkerParent, parseMediaOr } from './media-or';

export type MediaConditionList = MediaConditionListWithAnd | MediaConditionListWithOr;

export class MediaConditionListWithAnd {
	type = 'media-condition-list-and';

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

	tokens() {
		return [
			...this.before,
			this.leading.tokens(),
			...this.list.flatMap((item) => item.tokens()),
			...this.after,
		];
	}

	toString() {
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

	at(index: number | string) {
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

	walk(cb: (entry: { node: MediaConditionListWithAndWalkerEntry, parent: MediaConditionListWithAndWalkerParent }, index: number | string) => boolean) {
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
}

export type MediaConditionListWithAndWalkerEntry = MediaAndWalkerEntry | MediaAnd;
export type MediaConditionListWithAndWalkerParent = MediaAndWalkerParent | MediaConditionListWithAnd;

export function parseMediaConditionListWithAnd(componentValues: Array<ComponentValue>) {
	let leading: MediaInParens | false = false;
	const list: Array<MediaAnd> = [];
	let firstIndex = -1;
	let lastIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		if (leading) {
			const part = parseMediaAnd(componentValues.slice(i));
			if (part !== false) {
				i += part.advance;
				list.push(part.node);
				lastIndex = i;
				continue;
			}

			return false;
		}

		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (leading === false && componentValue.type === ComponentValueType.SimpleBlock) {
			leading = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (leading === false) {
				return false;
			}

			firstIndex = i;
			continue;
		}

		return false;
	}

	if (leading && list.length) {
		return new MediaConditionListWithAnd(
			leading,
			list,
			componentValues.slice(0, firstIndex).flatMap((x) => {
				return x.tokens();
			}),
			componentValues.slice(lastIndex + 1).flatMap((x) => {
				return x.tokens();
			}),
		);
	}

	return false;
}

export class MediaConditionListWithOr {
	type = 'media-condition-list-or';

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

	tokens() {
		return [
			...this.before,
			this.leading.tokens(),
			...this.list.flatMap((item) => item.tokens()),
			...this.after,
		];
	}

	toString() {
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

	at(index: number | string) {
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

	walk(cb: (entry: { node: MediaConditionListWithOrWalkerEntry, parent: MediaConditionListWithOrWalkerParent }, index: number | string) => boolean) {
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
}

export type MediaConditionListWithOrWalkerEntry = MediaOrWalkerEntry | MediaOr;
export type MediaConditionListWithOrWalkerParent = MediaOrWalkerParent | MediaConditionListWithOr;


export function parseMediaConditionListWithOr(componentValues: Array<ComponentValue>) {
	let leading: MediaInParens | false = false;
	const list: Array<MediaOr> = [];
	let firstIndex = -1;
	let lastIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		if (leading) {
			const part = parseMediaOr(componentValues.slice(i));
			if (part !== false) {
				i += part.advance;
				list.push(part.node);
				lastIndex = i;
				continue;
			}

			return false;
		}

		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (leading === false && componentValue.type === ComponentValueType.SimpleBlock) {
			leading = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (leading === false) {
				return false;
			}

			firstIndex = i;
			continue;
		}

		return false;
	}

	if (leading && list.length) {
		return new MediaConditionListWithOr(
			leading,
			list,
			componentValues.slice(0, firstIndex).flatMap((x) => {
				return x.tokens();
			}),
			componentValues.slice(lastIndex + 1).flatMap((x) => {
				return x.tokens();
			}),
		);
	}

	return false;
}
