import { ComponentValue, ComponentValueType, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenIdent } from '@csstools/css-tokenizer';
import { isIdent } from '../util/component-value-is';
import { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent, parseMediaInParensFromSimpleBlock } from './media-in-parens';

export class MediaAnd {
	type = 'media-and';

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

	walk(cb: (entry: { node: MediaAndWalkerEntry, parent: MediaAndWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}
}

export type MediaAndWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export type MediaAndWalkerParent = MediaInParensWalkerParent | MediaAnd;

export function parseMediaAnd(componentValues: Array<ComponentValue>) {
	let sawAnd = false;

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
			if (token[4].value.toLowerCase() === 'and') {
				if (sawAnd) {
					return false;
				}

				sawAnd = true;
				continue;
			}

			return false;
		}

		if (sawAnd && componentValue.type === ComponentValueType.SimpleBlock) {
			const media = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (media === false) {
				return false;
			}

			return {
				advance: i,
				node: new MediaAnd(
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
