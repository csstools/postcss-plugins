import { insertAfterKey, insertBeforeKey, insertOrderKey, pluginKey } from '../own-keys/keys.mjs';

// return a list of features to be inserted before or after cssdb features
export default function getTransformedInsertions(cssdbList, insertions, placement) {
	if (placement !== 'insertBefore' && placement !== 'insertAfter') {
		return [];
	}

	const insertPlacementKey = placement === 'insertBefore' ? insertBeforeKey : insertAfterKey;

	const out = [];

	for (const featureId in insertions) {
		if (!Object.hasOwnProperty.call(insertions, featureId)) {
			continue;
		}

		const cssdbFeature = cssdbList.find((feature) => {
			return feature.id === featureId;
		});

		if (!cssdbFeature) {
			continue;
		}

		let pluginsToInsert = insertions[featureId];
		if (!Array.isArray(pluginsToInsert)) {
			pluginsToInsert = [pluginsToInsert];
		}

		for (let i = 0; i < pluginsToInsert.length; i++) {
			out.push({
				id: featureId,
				// TODO : verify current behavior.
				// At the moment it is unclear if inserted plugins have logic around browser lists.
				// Adding this ensures they do, which might be a breaking change.
				...JSON.parse(JSON.stringify(cssdbFeature)), // deep copy
				[pluginKey]: pluginsToInsert[i],
				[insertOrderKey]: i,
				[insertPlacementKey]: true,
			});
		}
	}

	return out;
}
