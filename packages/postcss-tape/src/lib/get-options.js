import getOptionsFromArguments from './get-options-from-arguments';
import { readJSON } from './utils';
import path from 'path';

export default async function getOptions () {
	const cwd = process.cwd();

	// default options
	const defaultOptions = {
		plugin:   cwd,
		config:   cwd,
		fixtures: path.resolve(cwd, 'test')
	}

	const options = await readJSON('package.json', 'postcss', 'postcssConfig').then(
		packageOptions => getOptionsFromArguments(
			Object.assign(defaultOptions, packageOptions)
		)
	);

	const importedPluginFile = path.resolve(options.plugin);
	const importedPlugin = await import(importedPluginFile);

	options.plugin = importedPlugin;

	try {
		const importedConfigFile = path.extname(options.config)
			? path.resolve(options.config)
		: path.resolve(options.config, 'postcss-tape.config.js');

		const importedConfig = await import(importedConfigFile);

		options.config = importedConfig.default || importedConfig;
	} catch (ignoredError) {
		const importedConfigFile = path.resolve(options.config, '.tape.js');
		const importedConfig = await import(importedConfigFile);

		options.config = importedConfig.default || importedConfig;
	}

	return options;
}
