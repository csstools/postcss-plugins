import { promises as fsp } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const template = await fsp.readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), './install-template.md'), 'utf8');
const packageJSONInfo = JSON.parse(await fsp.readFile('./package.json', 'utf8'));

let installDoc = template.toString();
installDoc = installDoc.replaceAll('<exportName>', packageJSONInfo.csstools.exportName);
installDoc = installDoc.replaceAll('<humanReadableName>', packageJSONInfo.csstools.humanReadableName);
installDoc = installDoc.replaceAll('<packageName>', packageJSONInfo.name);
installDoc = installDoc.replaceAll('<packagePath>', path.join(path.basename(path.dirname(process.cwd())), path.basename(process.cwd())));

if (packageJSONInfo?.csstools?.assumesToProcessBundledCSS) {
	installDoc = installDoc.replaceAll('<parallelBuildsNotice>', `⚠️ [${packageJSONInfo.csstools.humanReadableName}] assumes to process your complete CSS bundle.<br>If your build tool processes files individually or in parallel the output will be incorrect.<br>Using [\`postcss-import\`](https://www.npmjs.com/package/postcss-import) and \`@import\` statements is one way to make sure your CSS is bundled before it is processed by this plugin.\n`);
	installDoc = installDoc.replaceAll('<otherPluginsInWebpack>', `["postcss-import"]`);
	// <parallelBuildsNotice>
} else {
	// Just a filler so that formatting doesn't become too complex.
	installDoc = installDoc.replaceAll('<parallelBuildsNotice>', ``);
	installDoc = installDoc.replaceAll('<otherPluginsInWebpack>', `// Other plugins`);
}

await fsp.writeFile('./INSTALL.md', installDoc);
