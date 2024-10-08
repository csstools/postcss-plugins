import fs from 'node:fs/promises';
import path from 'node:path';

const pluginName = process.argv.slice(2).join(' ');

// Plugin name checks
{
	if (!pluginName) {
		// eslint-disable-next-line no-console
		console.warn('A plugin name must be provided:\n  new-plugin <human readable name>\n  new-plugin Cascade Layers');
		process.exit(1);
	}

	if (pluginName.startsWith('postcss-')) {
		// eslint-disable-next-line no-console
		console.warn('Plugin name cannot start with "postcss-", it is added by this scripts.');
		process.exit(1);
	}

	if (pluginName.includes('/')) {
		// eslint-disable-next-line no-console
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

// eslint-disable-next-line no-console
console.log(`- Creating new plugin ${pluginName}`);

// Copy base plugin
{
	await fs.rm(pluginDir, { recursive: true, force: true });
	await fs.cp(basePluginDir, pluginDir, { recursive: true });

	// eslint-disable-next-line no-console
	console.log('- Copied base plugin to', pluginDir);
}

// Remove unnecessary files
{
	await fs.rm(path.join(pluginDir, 'dist'), { recursive: true, force: true });
	await fs.rm(path.join(pluginDir, 'node_modules'), { recursive: true, force: true });

	// eslint-disable-next-line no-console
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
	await fs.writeFile(
		path.join(pluginDir, 'CHANGELOG.md'),
		`# Changes to PostCSS ${pluginName}

### Unreleased (major)

- Initial version
`,
	);

	// eslint-disable-next-line no-console
	console.log('- Relabeled references to base plugin');
}

// Update package.json
{
	const packageInfo = JSON.parse(await fs.readFile(path.join(pluginDir, 'package.json'), 'utf8'));
	packageInfo.name = packageName;
	packageInfo.description = `TODO: Add description for ${pluginName}`;
	packageInfo.version = '0.0.0';
	packageInfo.homepage = `https://github.com/csstools/postcss-plugins/tree/main/plugins/${pluginSlug}#readme`;
	packageInfo.bugs = 'https://github.com/csstools/postcss-plugins/issues';
	packageInfo.csstools.exportName = exportName;
	packageInfo.csstools.humanReadableName = humanReadableName;

	delete packageInfo.private;

	packageInfo.repository.directory = `plugins/${pluginSlug}`;

	await fs.writeFile(path.join(pluginDir, 'package.json'), JSON.stringify(packageInfo, null, '\t'));

	// eslint-disable-next-line no-console
	console.log('- Updated "package.json"');
}

// eslint-disable-next-line no-console
console.log('\nDone! 🎉');

// Next steps
{
	console.log('\nYour next steps:'); // eslint-disable-line no-console
	console.log('- Run : "npm install" from the root directory'); // eslint-disable-line no-console
	console.log(`- Run : "cd plugins/${pluginSlug}"`); // eslint-disable-line no-console
	console.log('- Run : "npm run docs" to generate documentation'); // eslint-disable-line no-console
	console.log('- Run : "npm run build" to build your plugin'); // eslint-disable-line no-console
	console.log('- Run : "npm run test" to test your plugin'); // eslint-disable-line no-console
	console.log('- Run : "npm run test:rewrite-expects" to update test expects'); // eslint-disable-line no-console
	console.log('\nChange "blue" to "purple" in "src/index.ts" and see how it affects the test outcome'); // eslint-disable-line no-console
}

// Helpers
async function replaceBasePluginReferencesForFilePath(filePath) {
	await fs.writeFile(
		filePath,
		replaceBasePluginReferences(
			(await fs.readFile(filePath, 'utf8')).toString(),
		),
	);
}

function replaceBasePluginReferences(source) {
	source = source.replaceAll('@csstools/postcss-base-plugin', packageName);
	source = source.replaceAll('postcss-base-plugin', pluginSlug);
	source = source.replaceAll('Base Plugin', pluginName);

	return source;
}
