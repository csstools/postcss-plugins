import { packageNamesToIds } from '../src/plugins/plugins-map.mjs';
import cssdb from 'cssdb';
import { promises as fsp } from 'fs';

let featuresTable = '';

featuresTable = featuresTable + '| Name | ID | example | docs |\n';
featuresTable = featuresTable + '| --- | --- | --- | --- |\n';
for (const id of Object.values(packageNamesToIds)) {
	const cssdbFeature = cssdb.find(feature => feature.id === id);
	const cssdbPlugins = cssdbFeature.polyfills.filter(polyfill => polyfill.type === 'PostCSS Plugin');
	cssdbPlugins.sort((a) => {
		if (a.link.includes('https://github.com/csstools')) {
			return -1;
		}

		if (a.link.includes('https://github.com/postcss')) {
			return -1;
		}

		return 1;
	});

	featuresTable = featuresTable + `| ${cssdbFeature.title} `;
	featuresTable = featuresTable + `| \`${id}\` `;
	featuresTable = featuresTable + `| [example](https://preset-env.cssdb.org/features/#${id}) `;
	featuresTable = featuresTable + `| [docs](${cssdbPlugins[0].link}#readme) |\n`;
}

let featuresDoc = (await fsp.readFile('./docs/FEATURES.md', 'utf8')).toString();
featuresDoc = featuresDoc.replaceAll('<featuresTable>', featuresTable);

fsp.writeFile('FEATURES.md', featuresDoc, 'utf8');
