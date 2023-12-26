import { promises as fsp } from 'fs';
import path from 'path';

const pluginName = process.argv.slice(2).join(' ');

// Plugin name checks
{
	if (!pluginName) {
		console.warn('A plugin name must be provided:\n  new-plugin <human readable name>\n  new-plugin Cascade Layers');
		process.exit(1);
	}

	if (pluginName.startsWith('postcss-')) {
		console.warn('Plugin name cannot start with "postcss-", it is added by this scripts.');
		process.exit(1);
	}

	if (pluginName.includes('/')) {
		console.warn('Plugin name cannot contain "/"');
		process.exit(1);
	}
}

// Derived values
const pluginSlug = 'postcss-' + pluginName.replace(/\s+/g, '-').toLowerCase();
const packageName = '@csstools/' + pluginSlug;
const humanReadableName = 'PostCSS ' + pluginName;
const exportName = 'postcss' + pluginName.replace(/\s+/g, '');
const basePluginDir = './plugins/postcss-base-plugin';
const pluginDir = './plugins/' + pluginSlug;

console.log(`- Creating new plugin ${pluginName}`);

// Copy base plugin
{
	await fsp.rm(pluginDir, { recursive: true, force: true });
	await fsp.cp(basePluginDir, pluginDir, { recursive: true });

	console.log('- Copied base plugin to', pluginDir);
}

// Remove unnecessary files
{
	await fsp.rm(path.join(pluginDir, 'dist'), { recursive: true, force: true });
	await fsp.rm(path.join(pluginDir, 'node_modules'), { recursive: true, force: true });

	console.log('- Cleaned up files and directories not required in a new plugin');
}

// Relabel references to base plugin
{
	await replaceBasePluginReferencesForFilePath(path.join(pluginDir, 'src', 'index.ts'));
	await replaceBasePluginReferencesForFilePath(path.join(pluginDir, 'test', '_import.mjs'));
	await replaceBasePluginReferencesForFilePath(path.join(pluginDir, 'test', '_require.cjs'));
	await replaceBasePluginReferencesForFilePath(path.join(pluginDir, 'test', '_tape.mjs'));
	await replaceBasePluginReferencesForFilePath(path.join(pluginDir, 'README.md'));
	await replaceBasePluginReferencesForFilePath(path.join(pluginDir, 'INSTALL.md'));
	await fsp.writeFile(
		path.join(pluginDir, 'CHANGELOG.md'),
		`# Changes to PostCSS ${pluginName}

### Unreleased (major)

- Initial version
`,
	);

	console.log('- Relabeled references to base plugin');
}

// Update package.json
{
	const packageInfo = JSON.parse(await fsp.readFile(path.join(pluginDir, 'package.json'), 'utf8'));
	packageInfo.name = packageName;
	packageInfo.description = `TODO: Add description for ${pluginName}`;
	packageInfo.version = '0.0.0';
	packageInfo.homepage = `https://github.com/csstools/postcss-plugins/tree/main/plugins/${pluginSlug}#readme`;
	packageInfo.bugs = 'https://github.com/csstools/postcss-plugins/issues';
	packageInfo.csstools.exportName = exportName;
	packageInfo.csstools.humanReadableName = humanReadableName;

	delete packageInfo.private;

	packageInfo.repository.directory = `plugins/${pluginSlug}`;

	await fsp.writeFile(path.join(pluginDir, 'package.json'), JSON.stringify(packageInfo, null, '\t'));

	console.log('- Updated "package.json"');
}

console.log('\nDone! 🎉');

// Next steps
{
	console.log('\nYour next steps:');
	console.log('- Run : "npm install" from the root directory');
	console.log(`- Run : "cd plugins/${pluginSlug}"`);
	console.log('- Run : "npm run docs" to generate documentation');
	console.log('- Run : "npm run build" to build your plugin');
	console.log('- Run : "npm run test" to test your plugin');
	console.log('- Run : "npm run test:rewrite-expects" to update test expects');
	console.log('\nChange "blue" to "purple" in "src/index.ts" and see how it affects the test outcome');
}

// Helpers
async function replaceBasePluginReferencesForFilePath(filePath) {
	await fsp.writeFile(
		filePath,
		replaceBasePluginReferences(
			(await fsp.readFile(filePath, 'utf8')).toString(),
		),
	);
}

function replaceBasePluginReferences(source) {
	source = source.replaceAll('@csstools/postcss-base-plugin', packageName);
	source = source.replaceAll('postcss-base-plugin', pluginSlug);
	source = source.replaceAll('Base Plugin', pluginName);

	return source;
}
