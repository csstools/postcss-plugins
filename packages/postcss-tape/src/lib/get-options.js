import getOptionsFromArguments from './get-options-from-arguments';
import { readJSON } from './utils';
import path from 'path';

export default async function getOptions() {
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

	try {
		options.plugin = await import(
			path.resolve(options.plugin)
		);
	} catch (error1) {
		throw error1;
	}

	try {
		options.config = await import(
			path.extname(options.config)
				? path.resolve(options.config)
			: path.resolve(options.config, 'postcss-tape.config.js')
		);
	} catch (error1) {
		try {
			options.config = await import(
				path.extname(options.config)
					? path.resolve(options.config)
				: path.resolve(options.config, '.tape.js')
			);
		} catch (error2) {
			throw error2;
		}
	}

	return options;
}
