import { ComponentValue } from '@csstools/css-parser-algorithms';
import { MediaFeatureName, parseMediaFeatureName } from './media-feature-name';
import { NodeType } from '../util/node-type';
import { CSSToken } from '@csstools/css-tokenizer';

export class MediaFeatureBoolean {
	type = NodeType.MediaFeatureBoolean;

	name: MediaFeatureName;

	constructor(name: MediaFeatureName) {
		this.name = name;
	}

	getName(): string {
		return this.name.getName();
	}

	getNameToken(): CSSToken {
		return this.name.getNameToken();
	}

	tokens(): Array<CSSToken> {
		return this.name.tokens();
	}

	toString(): string {
		return this.name.toString();
	}

	indexOf(item: MediaFeatureName): number | string {
		if (item === this.name) {
			return 'name';
		}

		return -1;
	}

	at(index: number | string): MediaFeatureName | undefined {
		if (index === 'name') {
			return this.name;
		}
	}

	/**
	 * @internal
	 */
	toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			name: this.name.toJSON(),
			tokens: this.tokens(),
		};
	}

	/**
	 * @internal
	 */
	isMediaFeatureBoolean(): this is MediaFeatureBoolean {
		return MediaFeatureBoolean.isMediaFeatureBoolean(this);
	}

	static isMediaFeatureBoolean(x: unknown): x is MediaFeatureBoolean {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeatureBoolean)) {
			return false;
		}

		return x.type === NodeType.MediaFeatureBoolean;
	}
}

export function parseMediaFeatureBoolean(componentValues: Array<ComponentValue>): MediaFeatureBoolean|false {
	const mediaFeatureName = parseMediaFeatureName(componentValues);
	if (mediaFeatureName === false) {
		return mediaFeatureName;
	}

	return new MediaFeatureBoolean(mediaFeatureName);
}
