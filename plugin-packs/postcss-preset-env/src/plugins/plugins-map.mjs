import pluginsData from './plugins-data.mjs';

export function getFeaturesIds() {
	return pluginsData.map(feature => feature.id);
}

export function getPackageNames() {
	return pluginsData.map(feature => feature.packageName);
}

export function getPackageNamesToIds() {
	const dict = {};

	pluginsData.forEach(feature => {
		dict[feature.packageName] = feature.id;
	});

	return dict;
}
