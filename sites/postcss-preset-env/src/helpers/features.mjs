import { packageNamesToIds } from '../../../../plugin-packs/postcss-preset-env/src/plugins/plugins-map.mjs';

export default function getPostCSSPresetEnvFeatures(cssdb) {
	const filteredFeatures = [];
	const features = Object.values(packageNamesToIds);

	cssdb.forEach(feature => {
		if (features.includes(feature.id)) {
			filteredFeatures.push(feature);
		}
	});

	return filteredFeatures;
}
