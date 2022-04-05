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

await fsp.writeFile('./INSTALL.md', installDoc);
