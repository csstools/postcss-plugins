import cssdb from 'cssdb';
import fs from 'fs/promises';

let featuresTable = '';

featuresTable = featuresTable + '| | ID | Feature | example | docs |\n';
featuresTable = featuresTable + '|:--- |:--- |:--- |:--- |:--- |\n';

const pluginsData = await fs.readFile('./scripts/plugins-data.json', 'utf8').then(JSON.parse);
pluginsData.sort((a, b) => a.id.localeCompare(b.id));

for (const pluginData of pluginsData) {
	if (pluginData.omitDocs) {
		continue;
	}

	const cssdbFeature = cssdb.find(feature => feature.id === pluginData.id);
	const polyfills = cssdbFeature?.polyfills || [];
	const cssdbPlugins = polyfills?.filter(polyfill => polyfill.type === 'PostCSS Plugin');

	cssdbPlugins.sort((a) => {
		if (a.link.indexOf('https://github.com/csstools') === 0) {
			return -1;
		}

		if (a.link.indexOf('https://github.com/postcss') === 0) {
			return -1;
		}

		return 1;
	});

	if (cssdbFeature && cssdbPlugins.length > 0) {
		featuresTable = featuresTable + `| [<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/${pluginData.id}.svg" height="18">](https://cssdb.org/#${pluginData.id}) `;
		featuresTable = featuresTable + `| \`${pluginData.id}\` `;
		featuresTable = featuresTable + `| ${cssdbFeature.title} `;
		featuresTable = featuresTable + `| [example](https://preset-env.cssdb.org/features/#${pluginData.id}) `;
		featuresTable = featuresTable + `| [docs](${cssdbPlugins[0].link}#readme) |\n`;
	} else {
		featuresTable = featuresTable + '|   ';
		featuresTable = featuresTable + `| \`${pluginData.id}\` `;
		featuresTable = featuresTable + '|   ';
		featuresTable = featuresTable + '|   ';
		featuresTable = featuresTable + '|   |\n';
	}
}

let featuresDoc = (await fs.readFile('./docs/FEATURES.md', 'utf8')).toString();
featuresDoc = featuresDoc.replaceAll('<featuresTable>', featuresTable);

fs.writeFile('FEATURES.md', featuresDoc, 'utf8');
