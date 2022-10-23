import { ComponentValue, ComponentValueType, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenIdent } from '@csstools/css-tokenizer';
import { isIdent } from '../util/component-value-is';
import { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent, parseMediaInParensFromSimpleBlock } from './media-in-parens';

export class MediaOr {
	type = 'media-or';

	modifier: Array<CSSToken>;
	media: MediaInParens;

	constructor(modifier: Array<CSSToken>, media: MediaInParens) {
		this.modifier = modifier;
		this.media = media;
	}

	tokens() {
		return [
			...this.modifier,
			...this.media.tokens(),
		];
	}

	toString() {
		return stringify(...this.modifier) + this.media.toString();
	}

	indexOf(item: MediaInParens): number | string {
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

	walk(cb: (entry: { node: MediaOrWalkerEntry, parent: MediaOrWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}
}

export type MediaOrWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export type MediaOrWalkerParent = MediaInParensWalkerParent | MediaOr;

export function parseMediaOr(componentValues: Array<ComponentValue>) {
	let sawOr = false;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (isIdent(componentValue)) {
			const token = (componentValue.value as TokenIdent);
			if (token[4].value.toLowerCase() === 'or') {
				if (sawOr) {
					return false;
				}

				sawOr = true;
				continue;
			}

			return false;
		}

		if (sawOr && componentValue.type === ComponentValueType.SimpleBlock) {
			const media = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (media === false) {
				return false;
			}

			return {
				advance: i,
				node: new MediaOr(
					componentValues.slice(0, i).flatMap((x) => {
						return x.tokens();
					}),
					media,
				),
			};
		}

		return false;
	}

	return false;
}
