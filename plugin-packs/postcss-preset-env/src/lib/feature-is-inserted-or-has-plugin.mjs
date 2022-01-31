import { pluginsById } from '../plugins/plugins-by-id.mjs';
import { insertAfterKey, insertBeforeKey } from '../own-keys/keys.mjs';

export function featureIsInsertedOrHasAPlugin(feature) {
	if (feature[insertBeforeKey]) {
		// inserted;
		return true;
	}

	if (feature[insertAfterKey]) {
		// inserted;
		return true;
	}

	if (pluginsById.has(feature.id)) {
		// plugin exists in postcss-preset-env
		return true;
	}

	return false;
}
