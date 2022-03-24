import { readFile, writeFile } from 'fs/promises';
const pluginsData = await readFile('./scripts/plugins-data.json', 'utf8').then(JSON.parse);

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
	writeFile('./src/plugins/plugins-data.mjs', esmPlugins),
	writeFile('./src/plugins/plugins-by-id.mjs', generatePluginsByID(pluginsData)),
]);
