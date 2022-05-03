import { getFeaturesIds } from '../src/plugins/plugins-map.mjs';
import cssdb from 'cssdb';
import { promises as fsp } from 'fs';

let featuresTable = '';

featuresTable = featuresTable + '| ID | Feature | example | docs |\n';
featuresTable = featuresTable + '|:--- |:--- |:--- |:--- |\n';

const ids = getFeaturesIds();
ids.sort();

for (const id of ids) {
	const cssdbFeature = cssdb.find(feature => feature.id === id);
	const polyfills = cssdbFeature.polyfills || [];
	const cssdbPlugins = polyfills.filter(polyfill => polyfill.type === 'PostCSS Plugin');

	if (cssdbPlugins.length === 0) {
		continue;
	}

	cssdbPlugins.sort((a) => {
		if (a.link.indexOf('https://github.com/csstools') === 0) {
			return -1;
		}

		if (a.link.indexOf('https://github.com/postcss') === 0) {
			return -1;
		}

		return 1;
	});

	featuresTable = featuresTable + `| \`${id}\` `;
	featuresTable = featuresTable + `| ${cssdbFeature.title} `;
	featuresTable = featuresTable + `| [example](https://preset-env.cssdb.org/features/#${id}) `;
	featuresTable = featuresTable + `| [docs](${cssdbPlugins[0].link}#readme) |\n`;
}

let featuresDoc = (await fsp.readFile('./docs/FEATURES.md', 'utf8')).toString();
featuresDoc = featuresDoc.replaceAll('<featuresTable>', featuresTable);

fsp.writeFile('FEATURES.md', featuresDoc, 'utf8');
