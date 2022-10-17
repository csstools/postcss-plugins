import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { GeneralEnclosed } from './general-enclosed';
import { MediaCondition } from './media-condition';
import { MediaFeature } from './media-feature';

export class MediaInParens {
	type = 'media-in-parens';

	startToken?: CSSToken;
	endToken?: CSSToken;
	media: MediaCondition | MediaFeature | GeneralEnclosed;

	constructor(media: MediaCondition | MediaFeature | GeneralEnclosed, startToken?: CSSToken, endToken?: CSSToken) {
		this.startToken = startToken;
		this.endToken = endToken;
		this.media = media;
	}

	tokens() {
		if (this.media.type === 'general-enclosed') {
			return this.media.tokens();
		}

		if (this.media.type === 'media-feature') {
			return this.media.tokens();
		}

		if (this.media.type === 'media-condition') {
			if (!this.startToken || !this.endToken) {
				throw new Error('Failed to list tokens for "media-in-parens" with "media-condition"');
			}

			return [
				this.startToken,
				...this.media.tokens(),
				this.endToken,
			];
		}

		throw new Error('Failed to list tokens for "media-in-parens"');
	}

	toString() {
		if (this.media.type === 'general-enclosed') {
			return this.media.toString();
		}

		if (this.media.type === 'media-feature') {
			return this.media.toString();
		}

		if (this.media.type === 'media-condition') {
			if (!this.startToken || !this.endToken) {
				throw new Error('Failed to stringify "media-in-parens" with "media-condition"');
			}

			return stringify(this.startToken) + this.media.toString() + stringify(this.endToken);
		}

		throw new Error('Failed to stringify "media-in-parens"');
	}

	walk(cb: (entry: { node: ComponentValue | MediaCondition | MediaFeature | GeneralEnclosed, parent: ContainerNode | MediaInParens | GeneralEnclosed }, index: number) => boolean) {
		if (cb({ node: this.media, parent: this }, 0) === false) {
			return false;
		}

		if ('walk' in this.media) {
			return this.media.walk(cb);
		}
	}
}
