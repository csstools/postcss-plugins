const cssdb = require('cssdb');
const fs = require('fs/promises');
const path = require('path');

module.exports = async function features() {
	// Odd workaround since Eleventy does not support mjs yet
	// See https://github.com/11ty/eleventy/issues/836
	const filePath = path.resolve(
		path.dirname(__filename),
		'../../../plugin-packs/postcss-preset-env/src/plugins/plugins-map.mjs',
	);
	const fileContent = await fs.readFile(filePath, 'utf8');
	const lines = fileContent.split('\n');
	const features = [];

	for (let i = 1; i < lines.length; i++) {
		if (lines[i].trim() === '};') {
			break;
		}

		const [,featureName] = lines[i].split(':');
		features.push(featureName.trim().replace(/'/g, '').replace(',', ''));
	}

	return cssdb.filter(feature => features.includes(feature.id));
};
