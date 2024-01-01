import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const pluginsData = await fs.readFile('./scripts/plugins-data.json', 'utf8').then(JSON.parse);

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

function generatePluginOptions(data) {
	const plugins = data.slice().filter((x) => !x.omitTypedOptions).sort((a, b) => a.id.localeCompare(b.id));
	let result = '';

	for (let i = 0; i < plugins.length; i++) {
		const plugin = plugins[i];

		if (existsSync(path.join('./src/types/', plugin.packageName, 'plugin-options.ts'))) {
			result += `import type { ${plugin.importName}Options } from '${path.posix.join('../types/', plugin.packageName, 'plugin-options')}';\n`;
		} else {
			result += `import type { pluginOptions as ${plugin.importName}Options } from '${plugin.packageName}';\n`;
		}
	}

	result += '\nexport type pluginsOptions = {\n';

	for (let i = 0; i < plugins.length; i++) {
		const plugin = plugins[i];
		result += `\t/** plugin options for "${plugin.packageName}" */\n`;
		result += `\t'${plugin.id}'?: ${plugin.importName}Options | boolean\n`;
	}

	result += '};\n';

	return result;
}

await Promise.all([
	fs.writeFile('./src/plugins/plugins-data.mjs', esmPlugins),
	fs.writeFile('./src/plugins/plugins-by-id.mjs', generatePluginsByID(pluginsData)),
	fs.writeFile('./src/plugins/plugins-options.ts', generatePluginOptions(pluginsData)),
]);
