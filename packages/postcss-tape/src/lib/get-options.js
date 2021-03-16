import { getOptionsFromArguments } from './get-options-from-arguments.js'
import { readJSON } from './utils.js'
import path from 'path'

/** Asynchronously return the options from the project. */
export const getOptions = async () => {
	const cwd = process.cwd()

	// default options
	const defaultOptions = {
		plugin: cwd,
		config: cwd,
		fixtures: path.resolve(cwd, 'test'),
	}

	const options = await readJSON('package.json', 'postcss', 'postcssConfig').then(packageOptions => getOptionsFromArguments(Object.assign(defaultOptions, packageOptions)))

	const importedPluginFile = path.resolve(options.plugin)
	const importedPlugin = await import(importedPluginFile)

	options.plugin = importedPlugin

	if (path.extname(options.config)) {
		const importedConfig = await import(path.resolve(options.config))

		options.config = importedConfig.default || importedConfig

		return options
	} else {
		const postcssTapeConfigFiles = [
			'postcss-tape.config.js',
			'postcss-tape.config.mjs',
			'postcss-tape.config.cjs',
			'.tape.js',
			'.tape.mjs',
			'.tape.cjs'
		]

		let returnError

		while (postcssTapeConfigFiles.length) {
			const postcssTapeConfigFile = path.resolve(options.config, postcssTapeConfigFiles.shift())

			try {
				const importedConfig = await import(postcssTapeConfigFile)
				options.config = importedConfig.default || importedConfig
				return options
			} catch (error) {
				if (!returnError) returnError = error
				continue
			}
		}

		throw returnError
	}
}
