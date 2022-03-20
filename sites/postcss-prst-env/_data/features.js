const cssdb = require('cssdb');
const presetEnvPluginsData = require('../../../plugin-packs/postcss-preset-env/scripts/plugins-data.json');

module.exports = async function features() {
	const features = presetEnvPluginsData.map(feature => feature.id);
	return cssdb.filter(feature => features.includes(feature.id));
};
