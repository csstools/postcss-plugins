import { readFile, writeFile } from 'fs/promises';
import { URL } from 'url';
import path from 'path';
const __dirname = new URL('.', import.meta.url).pathname;
const pluginsPath = path.resolve(__dirname, './plugins-data.json');
const pluginsData = await readFile(pluginsPath, 'utf8').then(JSON.parse);

const esmPlugins = `export default ${JSON.stringify(pluginsData, null, 2)}\n`;

function generatePluginsByID(data) {
	const plugins = data.slice(0).sort((a, b) => a.id.localeCompare(b.id));
	let result = '';

	for (let i = 0; i < plugins.length; i++) {
		const plugin = plugins[i];
		result += `import ${plugin.importName} from '${plugin.importedPackage || plugin.packageName}';\n`;
	}

	result += `
// postcss plugins ordered by id
export const pluginsById = new Map(
\t[\n`;

	for (let i = 0; i < plugins.length; i++) {
		const plugin = plugins[i];
		result += `\t\t['${plugin.id}', ${plugin.importName}],\n`;
	}

	result += '\t],\n);\n';

	return result;
}

await Promise.all([
	writeFile(path.resolve(__dirname, '../src/plugins/plugins-data.mjs'), esmPlugins),
	writeFile(path.resolve(__dirname, '../src/plugins/plugins-by-id.mjs'), generatePluginsByID(pluginsData)),
]);
