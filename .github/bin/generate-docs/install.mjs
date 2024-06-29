import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parallelBuildsNotice } from './parallel-builds-notice.mjs';

const template = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), './install-template.md'), 'utf8');
const packageJSONInfo = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

let installDoc = template.toString();
installDoc = installDoc.replaceAll('<exportName>', packageJSONInfo.csstools.exportName);
installDoc = installDoc.replaceAll('<humanReadableName>', packageJSONInfo.csstools.humanReadableName);
installDoc = installDoc.replaceAll('<packageName>', packageJSONInfo.name);
installDoc = installDoc.replaceAll('<packagePath>', path.join(path.basename(path.dirname(process.cwd())), path.basename(process.cwd())));

if (packageJSONInfo?.csstools?.assumesToProcessBundledCSS) {
	installDoc = installDoc.replaceAll('<parallelBuildsNotice>', parallelBuildsNotice(packageJSONInfo.csstools.humanReadableName));
	installDoc = installDoc.replaceAll('<otherPluginsInWebpack>', '["@csstools/postcss-bundler"]');
	// <parallelBuildsNotice>
} else {
	// Just a filler so that formatting doesn't become too complex.
	installDoc = installDoc.replaceAll('<parallelBuildsNotice>', '');
	installDoc = installDoc.replaceAll('<otherPluginsInWebpack>', '// Other plugins');
}

fs.writeFileSync('./INSTALL.md', installDoc);
