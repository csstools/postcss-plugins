// usage :
// npm run generate <plugin> <test case type> <seed> --workspace="@csstools/generate-test-cases"
// npm run generate css-blank-pseudo selector :blank --workspace="@csstools/generate-test-cases"

const fs = require('fs');
const path = require('path');

const pluginName = process.argv.slice(2)[0];
const genType = process.argv.slice(2)[1];
const generateSelectorTestCases = require('./selector.js');

const allowedPlugins = [
	'postcss-env-function',
	'postcss-nesting',
	'postcss-logical',
	'postcss-pseudo-class-any-link',
	'css-blank-pseudo',
];

if (allowedPlugins.indexOf(pluginName) === -1) {
	console.log('plugin provided as argument is not present in allow list');
	process.exit(1);
}

const pluginDir = path.join('../../plugins', pluginName);

main();
function main() {
	switch (genType) {
		case 'selector':
			fs.writeFileSync(path.join(pluginDir, 'test', 'generated-selector-cases.css'), process.argv.slice(4).map((selector) => {
				return generateSelectorTestCases(selector);
			}).join('\n'));
			break;

		default:
			break;
	}
}
