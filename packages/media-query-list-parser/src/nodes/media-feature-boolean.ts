import { ComponentValue } from '@csstools/css-parser-algorithms';
import { MediaFeatureName, parseMediaFeatureName } from './media-feature-name';
import { NodeType } from './node-type';

export class MediaFeatureBoolean extends MediaFeatureName {
	type = NodeType.MediaFeatureBoolean;
}

export function parseMediaFeatureBoolean(componentValues: Array<ComponentValue>) {
	const mediaFeatureName = parseMediaFeatureName(componentValues);
	if (mediaFeatureName === false) {
		return mediaFeatureName;
	}

	return new MediaFeatureBoolean(mediaFeatureName.name, mediaFeatureName.before, mediaFeatureName.after);
}
